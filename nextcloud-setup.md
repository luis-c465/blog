---
title: Setting up Nextcloud in docker connected to an external SMB server
prev: false
next: false
outline: [2,4]
date: Sun Oct 13 2024
---

# Setting up Nextcloud in docker connected to an external SMB server

![NextCloud](/assets/nextcloud-setup/index.png)

This guide goes over how to setup **Nextcloud in docker** on a **Linux machine** where the data is stored on an **external SMB server**.

The guide assumes you are setting up nextcloud  from scratch and have some experience with docker 🚢 and nextcloud ☁️, and already have an external SMB 🗃️ server set up and ready to use.

## Steps

1. Mount the SMB drive to the host machine
2. Install docker
3. Setup a docker compose file for nextcloud
4. Setup nextcloud

## Mount the SMB share


First we need to mount the SMB share to the host machine.

In my case I am using a NAS (running Truenas) sharing an SMB connection, which will I will mount at `/mnt/nextcloud`. Though any SMB drive will work.


### Create a mnt folder

First create a folder in the mnt directory of the host machine and name it nextcloud, then change the owner of that folder to www-data:www-data.

This is **required** for nextcloud to be able to write files to the mounted directory.


```shell
sudo mkdir /mnt/nextcloud
sudo chown -R www-data:www-data /mnt/nextcloud
```

### Install cifs-utils

Next install the `cifs-utils` package on the host machine, which will allow us to mount the SMB drive to the host machine

```shell
sudo apt-get install -y cifs-utils
```

### Append to `/etc/fstab`

Next we will append to `/etc/fstab` which it a textfile which is read on computer startup which can be used to mount drives at startup.

**Fill in** the values in brackets with the correct values for your setup, then run the command

```shell
sudo echo "//[IP ADDRESS OF MACHINE]/[SMB SHARE NAME]/"                                 \
     "/mnt/nextcloud"                                                                   \
     "cifs"                                                                             \
     "username=[USERNAME],password=[PASSWORD],uid=33,gid=33,noauto,x-systemd.automount" \
     "0 0"                                                                              \
     >> /etc/fstab
```

### Mount and troubleshoot

Now run `mount -a` to mount the drive.

Then check that it is mounted by running `sudo df | grep /mnt/nextcloud` and verifying that there is output.

It should look something like this:

`192.168.1.3:/nextcloud       10924796928  697999360 10226797568   7% /mnt/nextcloud`



## Install Docker

First we need to install and setup docker on the host machine. Run the following command:

```shell
sudo apt-get install -y curl
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

## Docker Compose setup

### Create a directory for Nextcloud

First we need to create a directory for the nextcloud container to store its data in. Run this command:

```bash
sudo mkdir -p /srv/docker/nextcloud/{main,db,container-config}
sudo cd /srv/docker/nextcloud
```

This creates the following directory structure:

```yaml
srv:
  docker:
    nextcloud:
      main:
        # Nextcloud data files
      db:
        # Nextcloud PostgreSQL database
      container-config:
        # Config files for the nextcloud container
```

### Docker Compose file

Using a terminal texteditor of your choosing (`nano`, `vim`, `emacs`) create a new file called `docker-compose.yml`. This is where we will define our docker containers and how they should be linked together.

Paste the following into the file:

::: code-group

<<< @/snippets/nextcloud-setup/docker-compose.yml

:::


This creates the following containers:

| Container   | Description                                                                                                                      |
|-------------|----------------------------------------------------------------------------------------------------------------------------------|
| `app`       | The main nextcloud container. This is where all the functionality for Nextcloud from including file storage, authentication, etc |
| `web`       | The web server that serves up files and provides a reverse proxy to the app container for better performance                     |
| `db`        | The database or place where all data about files, users, events etc are stored                                                   |
| `redis`     | The cache for File locking and more                                                                                              |
| `cron`      | The background job executor                                                                                                      |
| `imaginary` | The image preview generator                                                                                                      |


### Environment file

Again using any terminal text editor create a `.env` file in the same directory as your `docker-compose.yml` file and add the following, replacing the password with a secure one.

```dotenv
POSTGRES_PASSWORD=[SUPER_SECURE_PASSWORD124]
POSTGRES_USER=nextcloud
```

### Container Config

Before you may have noticed a `container-config` directory was created. Here we will add 2 configuration files for the app container and the web container. These will be mounted into the app and web containers respectively so that you may configure them without having to rebuild the containers.

#### Web (nginx) config

Create a file called `nginx.conf` in the `container-config` directory and add the following nginx config to modify the reverse proxy / webserver to the app container:

The config below was taken from the [Official Nextcloud Docker examples](https://github.com/nextcloud/docker/blob/178f8b65d34f49f649aa729de148c24a4d79db84/.examples/docker-compose/with-nginx-proxy/postgres/fpm/web/nginx.conf)

::: code-group

<<< @/snippets/nextcloud-setup/nginx.conf{nginx}

:::

#### App (Php FPM) config

Next create a file called `php-fpm.www.conf` in the `container-config` directory and add the following ini config for the Nextcloud FPM CGI making it more performant, by setting a static number of child GCI process's

The changed values are `pm` and its following values like `pm.max_children`. There are in depth comments above each and every configuration value explaining their options and how they work if you would like to tweak them, though the bellow config worked for me.

The config bellow is a modified php-fpm config, to see a similar unmodified base see [PHP Source Code](https://github.com/php/php-src/blob/7ff940f2a2ac1d18dce8dd2f33947d5e226039d1/sapi/fpm/www.conf.in)

::: code-group

<<< @/snippets/nextcloud-setup/php-fpm.www.conf{ini}

:::

### Staring up Nextcloud

Now that you have everything setup, start up your containers using `docker-compose up -d` when in the `/srv/docker/nextcloud` directory. This will take a while the first time as it needs to download all of the images, then setup nextcloud. Once it's done, open up your browser and go to `http://localhost:8080` and you should see the Nextcloud login screen.

::: tip Troubleshooting
Check container logs using `docker-compose logs -f`.
:::

#### Admin User Setup

When first opening the app you will be prompted to **create an admin user**, fill out the form with your wanted username and password and click Install.

![Nextcloud Admin Creation Step](/assets/nextcloud-setup/setup.png)

Once done, it will setup the server then redirect you to the dashboard screen showing the following

![Nextcloud Dashboard](/assets/nextcloud-setup/dashboard.png)

## Closing thoughts

Thats all for setting up nextcloud, if you have any questions or issues please feel free to leave a comment below and I'll try to help out as much as possible!

Good luck with your nextcloud setup! 🎉
