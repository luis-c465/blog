---
title: Proxmox XTerm.js on a Linux vm
prev: false
next: false
outline: [2,4]
date: Thu Oct 24 2024
---

# Proxmox XTerm.js on a Linux vm

![Proxmox](/public/proxmox-xterm/index.png)

This goes over how to setup **xterm.js in a Proxmox Linux vm**. The following was tested to work with the latest version of Proxmox, as well as **Ubuntu 20.04 LTS**, and **Debian bookworm (12)**.

## Add the Serial Port

First we need to add a serial port to our VM.

In the Proxmox web interface, navigate to the VM you want to add a serial port to.

Then click under `Hardware > Add > Serial Port` and enter the serial port number `0` and click `Add`.

![Serial Port](/public/proxmox-xterm/serial.png)

::: tip Restart the VM
You will need to restart your VM for this change to take effect. So restart before continuing.
:::

## Update the Grub Config

With the machine restarted, we can now add the serial port to our grub config

In any text editor open `/etc/default/grub` and find `GRUB_CMDLINE_LINUX_DEFAULT`

Change it to match the following:

```txt
GRUB_CMDLINE_LINUX="quiet console=tty0 console=ttyS0,115200"
```

Next run the command bellow to put the change into effect

```bash
update-grub
```

::: tip Restart the VM once more
You will need to restart your VM for this change to take effect. So restart before continuing.
:::

## Going further

That should be it to setup the serial port. So you can now use it by clicking on the console icon in Proxmox 🎉.

![Using the Console](/public/proxmox-xterm/xterm-btn.png)

Though it leaves a small problem, when starting xterm.js in the Proxmox web gui the [terminal does not resize properly](https://forum.proxmox.com/threads/xterm-js-console-doesnt-set-terminal-size-correctly.92205/). This leads to some jank when editing text or viewing long output.

We can fix this by adding a script that will run every time we start our VM

The following is a script to fix this by [GarrettB](https://forum.proxmox.com/members/garrettb.57503/) from the Proxmox forum.
Full credit goes to him for the [code](https://forum.proxmox.com/threads/xterm-js-console-doesnt-set-terminal-size-correctly.92205/post-531171).

---

Just add the following to the bottom of `/etc/profile` and now when you start your VM the terminal will resize properly.
Additionally if you want to manyally resize it you can use the `res` command.

```bash
res() {

  old=$(stty -g)
  stty raw -echo min 0 time 5

  printf '\0337\033[r\033[999;999H\033[6n\0338' > /dev/tty
  IFS='[;R' read -r _ rows cols _ < /dev/tty

  stty "$old"

  # echo "cols:$cols"
  # echo "rows:$rows"
  stty cols "$cols" rows "$rows"
}

[ $(tty) = /dev/ttyS0 ] && res
```

## Further Reading & References

- [Proxmox Wiki Serial Terminal](https://pve.proxmox.com/wiki/Serial_Terminal)
- [Similar Article](https://devopstales.github.io/virtualization/proxmox-xtermjs-enable/)
