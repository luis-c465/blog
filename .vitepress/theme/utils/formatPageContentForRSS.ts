import * as cheerio from 'cheerio';

/**
 * Use Cheerio to perform some transformations on the rendered output
 * of each page to make it suitable for inclusion in an RSS feed.
 *
 * taken from: https://github.com/egardner/ericgardner.info/blob/3a5a0aca7108136df8ae344a39887a1b6163a4d0/.vitepress/theme/utils/formatPageContentForRSS.ts
 *
 * @param htmlString
 * @return string|null
 */
export default function formatPageContentForRSS( htmlString: string, hostname: string ) : string | null {
    const $ = cheerio.load( htmlString );
    const images = $( 'figure img' );
    images.each( function() {
        const current = $( this ).attr( 'src' );
        $( this ).attr( 'src', `${hostname}${current}` );
    } );

    return $( 'main' ).html();
}
