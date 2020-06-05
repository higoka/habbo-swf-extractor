<?php

foreach (glob('resource/*.swf') as $file) {
    $file = substr($file, 9, -4);

    shell_exec("java -jar ffdec/ffdec.jar -export binaryData,image resource/{$file} resource/{$file}.swf");

    echo "extracted: {$file}\n";
}
