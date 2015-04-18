---
date: 2015-04-18 15:43:40
tags: [osx,dock,hazel,launchd]
title: An alternative to undelete in osx (and hiding the trash icon in the dock)
---

### Hazel Trash Preference

I’ve been thinking about getting an undelete program for OSX for a while, but I hadn’t really found one that I liked. A few weeks ago I purchased [Hazel](http://www.noodlesoft.com/hazel.php) (for an unrelated thing), and found that it had a really neat feature where it can delete files in your Trash folder if the file os older than X number of days:

![Hazel System Preferences](http://coopcoding.com/assets/images/blogpostimages/HazelSystemPreferences.png)



I realised this could be used as a poor-mans alternative to undelete

### Removing the trash icon from the dock

One thing that could mess up this system though is accidentally emptying the trash. I have it pretty set in my brain that whenever I see the full trash icon in the dock I should right-click it and empty it, so I figured I’d better remove the trash icon in order to remove the temptation.

After google-ing for a bit, I found [this post](http://apple.stackexchange.com/questions/30415/how-can-i-remove-the-finder-icon-from-my-dock) about removing the Finder icon from the dock, and then [this post](https://discussions.apple.com/thread/6638249) specifically about removing the Trash icon. Basically you need to alter the `/System/Library/CoreServices/Dock.app/Contents/Resources/DockMenus.plist` file by inserting some XML to add a “Remove From Dock” option to the right-click menu for the Dock.

In [the comments](http://apple.stackexchange.com/questions/30415/how-can-i-remove-the-finder-icon-from-my-dock#comment34912_30429) on the first post, it’s mentioned that you could automate this from the command line by using `defaults write`, but in practice I found that this converts `DocMenus.plist` from an XML text file to an XML binary file. The new binary XML file didn’t seem to work for me; no menu showed up on right click even after restarting the dock by running `killall Dock` from the Terminal, so I had a quick hunt around for XML parsers/editors that work from the command line on OSX.

[XMLStarlet](http://xmlstar.sourceforge.net/) seemed to be fairly popular so I installed it using the always helpful [Homebrew](http://brew.sh/). (after Homebrew is installed, you just need to run `brew install xmlstarlet`).

The `DockMenus.plist` XML looks like this: [https://gist.github.com/Darkle/2ca4152ec3cbc90b8aa9](https://gist.github.com/Darkle/2ca4152ec3cbc90b8aa9)

Specifically, we are after the array after the `<key>trash</key>`:

``` markup
    <key>trash</key>
    <array>
      <dict>
        <key>command</key>
        <integer>1000</integer>
        <key>name</key>
        <string>OPEN</string>
      </dict>
      <dict>
        <key>command</key>
        <integer>2000</integer>
        <key>separator</key>
        <true/>
      </dict>
      <dict>
        <key>command</key>
        <integer>1001</integer>
        <key>dynamic</key>
        <integer>0</integer>
        <key>name</key>
        <string>EMPTY_TRASH</string>
      </dict>
      <dict>
        <key>command</key>
        <integer>1040</integer>
        <key>dynamic</key>
        <integer>2</integer>
        <key>name</key>
        <string>SECURE_EMPTY_TRASH</string>
      </dict>
    </array>
```

What we want to do is insert the following XML into the array element immediately after the `<key>trash</key>` element:

``` markup
<dict>
  <key>command</key>
  <integer>1004</integer>
  <key>name</key>
  <string>REMOVE_FROM_DOCK</string>
</dict>
```

After reading through the [documentation for editing XML files](http://xmlstar.sourceforge.net/doc/UG/xmlstarlet-ug.html#idm47077139594320) in XMLStarlet, it seemed like the natural thing to use would be the `-a` option to append new XML elements like so:

``` bash
xml ed -a "/foo/bar" -t elem -n dict
```

(`ed` command is for editing, `-a` option is for “append”, `-t` is for the type of element you are appending, in this case an “elem” or element and `-n` for the name of the element).

but for some reason append in XMLStarlet inserts the new element you are creating as a sibling to the element you selected in the xpath. So you seem to need to use the `-s` subnode command to insert elements as childnodes of the element the xpath selects.

To get the trash key via xpath, we can use

``` bash
"/plist/dict/key[.='trash']" ...
```

then we grab the first sibling and make sure it’s an array

``` bash
"/following-sibling::*[1][self::array]"
```

so all up its

``` bash
"/plist/dict/key[.='trash']/following-sibling::*[1][self::array]"
```

Then as the XMLStarlet command

``` bash
xml ed -L -s "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]" -t elem -n dict
```

(`-L` option means to [edit the file in place](http://stackoverflow.com/questions/5954168/how-to-insert-a-new-element-under-another-with-xmlstarlet/9172796#9172796))

This should result in the following XML inside the trash array

``` markup
    <array>
      <dict>
        <key>command</key>
        <integer>1000</integer>
        <key>name</key>
        <string>OPEN</string>
      </dict>
      <dict>
        <key>command</key>
        <integer>2000</integer>
        <key>separator</key>
        <true/>
      </dict>
      <dict>
        <key>command</key>
        <integer>1001</integer>
        <key>dynamic</key>
        <integer>0</integer>
        <key>name</key>
        <string>EMPTY_TRASH</string>
      </dict>
      <dict>
        <key>command</key>
        <integer>1040</integer>
        <key>dynamic</key>
        <integer>2</integer>
        <key>name</key>
        <string>SECURE_EMPTY_TRASH</string>
      </dict>
      <dict>
      </dict>
    </array>
```

The lack of attributes (classes or id’s) or text in the dict elements makes it tough to be sure we are getting the right one to next insert the

``` markup
  <key>command</key>
  <integer>1004</integer>
  <key>name</key>
  <string>REMOVE_FROM_DOCK</string>
```

so I used the xpath option of checking for a dict element that had no child nodes, and then giving it a unique id to make the rest of the XML editing easier

``` bash
xml ed -L -s "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]" -t elem -n dict \
-i "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]/dict[not(*)]" -t "attr" -n "id" -v "removeFromDockDictionaryInsert"
```

With XMLStarlet you can chain commands, so this is just the first subnode command with the new commands added at the end. You see we’re using the `-i` option to insert something and that something’s type is an attribute (“attr”) with a name of “id” and a value of ”removeFromDockDictionaryInsert”.

Now it’s easier to add more elements by just querying

``` bash
"//dict[@id='removeFromDockDictionaryInsert']"
```

Here is the final complete command

``` bash
xml ed -L -s "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]" -t elem -n dict \
-i "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]/dict[not(*)]" -t "attr" -n "id" -v "removeFromDockDictionaryInsert" \
-s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n key -v "command" \
-s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n integer -v 1004 \
-s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n key -v "name" \
-s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n string -v "REMOVE_FROM_DOCK" DocMenus.plist
```

After this is run on the `DocMenus.plist` file, your right-click menu for the Trash icon in the dock should look like this:

![Remove From Dock Menu](http://coopcoding.com/assets/images/blogpostimages/RemoveFromDockMenu.jpg)

### Removing on startup via launchd

I decided on using a bash script to backup the default `DockMenus.plist`file, run the XMLStarlet commands and then hide the Trash icon via an applescript.

The bash script looks as follows

``` bash
#!/bin/sh
export PATH=/usr/local/bin:$PATH

### Back up the DockMenus.plist file
origPlist=/System/Library/CoreServices/Dock.app/Contents/Resources/DockMenus;
backupFolder=/Users/coop/Dropbox/OSXStuff/DockTrashScripts
cp $origPlist.plist $backupFolder/DockMenus-BAK.plist;

### Edit the DockMenus.plist file with XMLStarlet
xml ed -L -s "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]" -t elem -n dict -i "/plist/dict/key[.='trash']/following-sibling::*[1][self::array]/dict[not(*)]" -t "attr" -n "id" -v "removeFromDockDictionaryInsert" -s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n key -v "command" -s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n integer -v 1004 -s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n key -v "name" -s "//dict[@id='removeFromDockDictionaryInsert']" -t elem -n string -v "REMOVE_FROM_DOCK" $origPlist.plist

### Run the applescript that select the right-click menu to hide the Trash icon
osascript $backupFolder/HideTrashIconInDock.scpt
```

and then make it executable by running `chmod +x` on the bash script file.

In the `HideTrashIconInDock.scpt` script is the following Applescript

``` applescript
tell application "System Events" to tell process "Dock"
	tell UI element "Trash" of list 1
		perform action "AXShowMenu"
		click menu item "Remove from Dock" of menu 1
	end tell
end tell
```

Then I created a file called `com.coop.removeTrashIconFromDock.plist` in the `/Users/coop/Library/LaunchAgents/`folder conatining the following XML

``` markup
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
	<dict>
		<key>Label</key>
		<string>com.coop.removeTrashIconFromDock</string>
		<key>Program</key>
		<string>/Users/coop/Dropbox/OSXStuff/DockTrashScripts/bakupAndAlterPlist.sh</string>
		<key>RunAtLoad</key>
		<true/>
	</dict>
</plist>
```



This file will be run by [launchd](http://launchd.info/) on startup. When this runs the first time, you will probably be asked to give `bakupAndAlterPlist.sh` Accessibility access in the OSX preferences.

If you don’t want to wait for a restart to load the Launch Agent, you can use the following command:

``` bash
launchctl load ~/Library/LaunchAgents/com.coop.removeTrashIconFromDock.plist
```

and to unload

``` bash
launchctl unload  ~/Library/LaunchAgents/com.coop.removeTrashIconFromDock.plist
```

More info here: [http://launchd.info/)](http://launchd.info/) (click on the “Operation” tab

Side note: For messing around with applescript in the terminal or in the applescript script editor with scripts that need to accesses accessibility features, you might want to add Terminal.app, [osascript](http://jacobsalmela.com/os-x-yosemite-osascript-enabling-access-assistive-devices/) and Script Editor.app to the Security and Privacy Accessibility

![Security & Privacy Preferences](https://support.apple.com/library/content/dam/edam/applecare/images/en_US/osx/privacy_prefs.png)