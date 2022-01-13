<?php

namespace Nordique;

class Write {

    /**
     *
     * Replaces existing marked info. Retains surrounding
     * data. Creates file if none exists.
     *
     *
     * @param string       $write_to    Filename to alter, base path is current theme.
     * @param string       $marker      The comment marker to alter.
     * @param string       $write_from  Filename of new code, base path is code folder in plugin.
     * @param array        $data        Data which is used render the correct code from the code template file.
     * @return bool True on write success, false on failure.
     *
     */
    public static function code($marker, $write_to, $write_from, $data = array()){
        $write_to = App::getThemePath() . $write_to;
        $write_from = App::getPath() . 'setup/code/' . $write_from;

        if(!file_exists($write_from)){
            return false;
        }

        $m = new \Mustache_Engine;
        $code = $m->render(file_get_contents($write_from), $data);

        return self::insertWithMarkers($write_to, $marker, $code);
    }

    public static function getCode($file){
        $file = App::getPath() . 'setup/code/' . $file;
        if(!file_exists($file)){
            return false;
        }

        return file_get_contents($file);
    }

    public static function addFile($filename, $content, $data = array()) {
        $filename = App::getThemePath() . $filename;
        $content = App::getPath() . 'setup/code/' . $content;

        if ( ! file_exists( $filename ) ) {
            if ( ! is_writable( dirname( $filename ) ) ) {
                return false;
            }
            if ( ! touch( $filename ) ) {
                return false;
            }
        } elseif ( ! is_writeable( $filename ) ) {
            return false;
        }

        $m = new \Mustache_Engine;
        $code = $m->render(file_get_contents($content), $data);

        return (bool)file_put_contents($filename, $code);
    }

    /**
     * Inserts an array of strings into a file (.htaccess), placing it between
     * BEGIN and END markers.
     *
     * Replaces existing marked info. Retains surrounding
     * data. Creates file if none exists.
     *
     * @since 1.5.0
     *
     * @param string       $filename  Filename to alter.
     * @param string       $marker    The marker to alter.
     * @param array|string $insertion The new content to insert.
     * @return bool True on write success, false on failure.
     *
     * Inspired by insert_with_markers from WordPress Core
     */
    private static function insertWithMarkers($filename, $marker, $insertion ) {
        if ( ! file_exists( $filename ) ) {
            if ( ! is_writable( dirname( $filename ) ) ) {
                return false;
            }
            if ( ! touch( $filename ) ) {
                return false;
            }
        } elseif ( ! is_writeable( $filename ) ) {
            return false;
        }

        if ( ! is_array( $insertion ) ) {
            $insertion = explode( "\n", $insertion );
        }

        $instructions = sprintf(
                'The directives (lines) between `BEGIN %1$s` and `END %1$s` are 
dynamically generated. Any changes to the directives between these markers will be overwritten.'
            , $marker
        );

        $instructions = explode( "\n", $instructions );
        foreach ( $instructions as $line => $text ) {
            $instructions[ $line ] = '# ' . $text;
        }

        $insertion = array_merge( $instructions, $insertion );

        $start_marker = "# BEGIN {$marker}";
        $end_marker   = "# END {$marker}";

        $fp = fopen( $filename, 'r+' );
        if ( ! $fp ) {
            return false;
        }

        // Attempt to get a lock. If the filesystem supports locking, this will block until the lock is acquired.
        flock( $fp, LOCK_EX );

        $lines = array();
        while ( ! feof( $fp ) ) {
            $lines[] = rtrim( fgets( $fp ), "\r\n" );
        }

        // Split out the existing file into the preceding lines, and those that appear after the marker
        $pre_lines        = array();
        $post_lines       = array();
        $existing_lines   = array();
        $found_marker     = false;
        $found_end_marker = false;
        foreach ( $lines as $line ) {
            if ( ! $found_marker && false !== strpos( $line, $start_marker ) ) {
                $found_marker = true;
                continue;
            } elseif ( ! $found_end_marker && false !== strpos( $line, $end_marker ) ) {
                $found_end_marker = true;
                continue;
            }
            if ( ! $found_marker ) {
                $pre_lines[] = $line;
            } elseif ( $found_marker && $found_end_marker ) {
                $post_lines[] = $line;
            } else {
                $existing_lines[] = $line;
            }
        }

        // Check to see if there was a change
        if ( $existing_lines === $insertion ) {
            flock( $fp, LOCK_UN );
            fclose( $fp );

            return true;
        }

        // Generate the new file data
        $new_file_data = implode(
            "\n",
            array_merge(
                $pre_lines,
                array( $start_marker ),
                $insertion,
                array( $end_marker ),
                $post_lines
            )
        );

        // Write to the start of the file, and truncate it to that length
        fseek( $fp, 0 );
        $bytes = fwrite( $fp, $new_file_data );
        if ( $bytes ) {
            ftruncate( $fp, ftell( $fp ) );
        }
        fflush( $fp );
        flock( $fp, LOCK_UN );
        fclose( $fp );

        return (bool) $bytes;
    }

}