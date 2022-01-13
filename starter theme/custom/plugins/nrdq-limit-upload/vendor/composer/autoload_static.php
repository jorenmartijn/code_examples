<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit98d0fd624a4b40c3f3008e4eecde868f
{
    public static $prefixLengthsPsr4 = array (
        'e' => 
        array (
            'enshrined\\svgSanitize\\' => 22,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'enshrined\\svgSanitize\\' => 
        array (
            0 => __DIR__ . '/..' . '/enshrined/svg-sanitize/src',
        ),
    );

    public static $prefixesPsr0 = array (
        'M' => 
        array (
            'Mustache' => 
            array (
                0 => __DIR__ . '/..' . '/mustache/mustache/src',
            ),
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit98d0fd624a4b40c3f3008e4eecde868f::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit98d0fd624a4b40c3f3008e4eecde868f::$prefixDirsPsr4;
            $loader->prefixesPsr0 = ComposerStaticInit98d0fd624a4b40c3f3008e4eecde868f::$prefixesPsr0;

        }, null, ClassLoader::class);
    }
}