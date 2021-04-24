#!/usr/bin/env python3
import sys
import os
import shutil

def copy(src, dst, ignore_pattern, delete_target_if_exist=False):
    print("DOING A COPY", src, dst)

    if delete_target_if_exist:
        delete(dst)

    try:
        shutil.copytree(src, dst, ignore=shutil.ignore_patterns(ignore_pattern))
    except OSError as e:
        # If the error was caused because the source wasn't a directory
        if e.errno == shutil.errno.ENOTDIR:
            shutil.copy(src, dst)
        else:
            print('Directory not copied. Error: %s' % e)

def delete(dst):
    if os.path.exists(dst):
        print("DELETING", dst, "...")
        shutil.rmtree(dst)

############################################################################
#script for packaging game into zip for itch.io

if __name__ == '__main__':
    outputFolder = "deployment/"
    if os.path.exists(outputFolder):
        shutil.rmtree(outputFolder)

    copy("assets", outputFolder + "assets", "", True)
    copy("scripts", outputFolder + "scripts", "", True)
    copy("index.html", outputFolder, "", False)

    print('Zipping...')

    shutil.make_archive('DeeperDeeperHTML5', 'zip', outputFolder)
    shutil.rmtree(outputFolder)

    waitToken = input("done.  Press any key to exit.")

