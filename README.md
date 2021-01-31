# habbo-swf-extractor

A small command-line utility tool for extracting Habbo *.swf files.

## How to use

First, install habbo-swf-extractor:

```bash
npm i -g habbo-swf-extractor
```

Now you can use it in one of this three ways:

```bash
habbo-swf-extractor --in /Path/To/InputDir --out /Path/To/OutputDir
```

```bash
swf-extract --in /Path/To/InputDir --out /Path/To/OutputDir
```

```bash
hse --in /Path/To/InputDir --out /Path/To/OutputDir
```

You need to set the input directory `--in` where it reads the *.swf files
and an output directory `--out` where it puts the extracted files.

These paths can be relative to your current working directory or an absolute path.
