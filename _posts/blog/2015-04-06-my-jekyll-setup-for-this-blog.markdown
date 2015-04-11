---
title: My Jekyll Setup For This Blog
date: 2015-04-06 12:46:26
tags: [Jekyll, Alfred]
---

So I wanted to set up a coding blog I decided on using [Jekyll](http://jekyllrb.com/) because it’s relatively easy to set up and there’s tons of good info & tutorials on the web. I briefly played around with [Hugo](http://gohugo.io/), and although the documentation on the site is really good, I didn’t find much in the way of tutorials and articles from 3rd-party sites, so I stuck with Jekyll.

### Blog Structure

For the site structure, I wanted it to be `coopcoding.com/projects/projectname/` and `coopcoding.com/blog/blog post title/`. This turned out to be a bit more difficult than I first envisioned. The `coopcoding.com/blog/blog post title/` was fairly easy to set up, but `coopcoding.com/projects/projectname/` took a bit of work.

At first I thought I would use the [default](http://jekyllrb.com/docs/pages/) way of creating pages and just stick them in the `coopcoding.com/projects/` folder, but unfortunately there is currently (<small><small>jekyll 2.5.3</small></small>) no way to iterate through all the pages in a directory. You can use collections or add data to the data directory, but these won't really work with the default pagination.

What I ended up doing was creating only blog posts and giving them either a "blog" category or a "projects" category. Then I used tags for if I wanted to show a grouping of posts or projects, e.g. if I was creating a blog post or a project about a chrome extension, in the yaml front matter for that post I would write something like:

``` yaml
---
title:  "My Chrome Extension Project"
date:   2015-02-15 10:14:35
tags:
  -Chrome Extension
  -Browser
summary: "This is the summary for the chrome extension project"
---
```

Then in my _config.yml I put the following:

``` yaml
permalink: /:categories/:title
defaults:
  -
    scope:
      path: "blog"
      type: "posts"
    values:
      layout: "post"
      category: "blog"
  -
    scope:
      path: "projects"
      type: "posts"
    values:
      layout: "project"
      category: "projects"
```

The `permalink: /:categories/:title` tells jekyll to spit out all the posts in the `_posts` folder and take what category they are (in this case either a blog or project) and create subfolders in the output directory of `coopcoding.com/projects/` & `coopcoding.com/blog/` and generate all the blog posts in those subdirectories for each category.

Then I created an index.html page inside of the `/projects/` folder and inside of the `/blog/` folder. These were so that when a user visited `coopcoding.com/projects/`, they would be shown a list of the latest project pages, and when they visited `coopcoding.com/blog/`, they would be shown a list of the latest blog posts.

Here are screenshots of my Jekyll folder structure to better explain it:

![Jekyll Folder Structure](http://coopcoding.com/assets/images/blogpostimages/jek-folder-ss.png)

and a screenshot of Jekyll's output folder structure:

![Jekyll Output Folder Structure](http://coopcoding.com/assets/images/blogpostimages/jek-build-folder-structure.png)

Here is the html for the index.html in the `/projects/` folder: [https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/project.html](https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/project.html)

You can see I'm looping over the `site.categories.projects` and listing each post in the "projects" category.

It's pretty much the same for the html in the index.html in the `/blog/` folder: [https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/project.html](https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/project.html)

### Tags

For generating "tag" pages, I used the code and process listed [here](http://charliepark.org/tags-in-jekyll/). You can see the tag pages output in the screenshot of Jekyll's output folder structure above.

### Blog & Project Layouts

Obviously I wanted to have different layouts for the blog post and project posts, so I used the following in my `_config.yml`:

``` yaml
defaults:
  -
    scope:
      path: "blog"
      type: "posts"
    values:
      layout: "post"
      category: "blog"
  -
    scope:
      path: "projects"
      type: "posts"
    values:
      layout: "project"
      category: "projects"
```

This tells Jekyll that for posts in that end up in the path `coopcoding.com/blog/` and are of the type "posts" that they are all in the category of "blog" and should use the layout "post". The layout of "post" corresponds to the [post.html](https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/post.html) in the `_layouts directory`. It then tells Jekyll that for posts in that end up in the path `coopcoding.com/projects/` and are of the type "posts" that they are all in the category of "projects" and should use the layout "project". The layout of "post" corresponds to the [project.html](https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_layouts/project.html) in the `_layouts directory`.

You can also see my complete `_config.yml` here: [https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_config.yml](https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_config.yml)

### Syntax Highlighting

[Pygments](http://jekyllrb.com/docs/templates/#code-snippet-highlighting) is the default syntax highlighter for Jekyll. It's pretty good, but I didn't really like the syntax that you have to use for code blocks:

{% raw  %}

	{% highlight ruby %}

	def foo

	  puts 'foo'

	end

	{% endhighlight %}

{% endraw %}

Luckily, the Kramdown [markdown interpreter in Jekyll supports](http://jekyllrb.com/docs/configuration/#kramdown) Github Flavoured Markdown, specifically the [code blocks](https://help.github.com/articles/github-flavored-markdown/#syntax-highlighting). With this enabled, a code block like this:

	``` ruby

	def print_hi(name)

	  puts "Hi, #{name}"

	end

	print_hi('Tom')

	#=> prints 'Hi, Tom' to STDOUT.

	```

will be render into this HTML:

``` markup
<pre><code class="language-ruby">
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
</code></pre>
```

For the actual syntax highlighting, I couldn't seem to get rouge to generate line numbers, so I used [prism.js](http://prismjs.com/). The prism.js output looks great and I figure so long as the javascript is at the bottom of the page and not blocking anything loading it should be fine and wont annoy people viewing the page. On the [prism.js download page](http://prismjs.com/download.html) you can pick and choose what languages to support, which is pretty neat.

Prism checks any `<code>` elements on the page for the class `"language-foo"`, where "foo" is the name of the language that's in the code block.

One thing that did trip me up a bit with prism.js was that in order to use the line number feature, you need to give the code block a class of `line-numbers`, which isn't too big of a deal as I could just add the element attribute to the end of each code block like this:

	``` ruby

	def print_hi(name)

	  puts "Hi, #{name}"

	end

	print_hi('Tom')

	#=> prints 'Hi, Tom' to STDOUT.

	```

	{: .line-numbers}

But that seemed like a bit of a hassle, so I went ahead and looked in the kramdown source files that were installed on my computer; I'm on a mac, so the kramdown folder was in `/usr/local/Cellar/ruby/2.2.1/lib/ruby/gems/2.2.0/gems/kramdown-1.6.0/lib/kramdown/`. From that folder, I went to the `parser/kramdown/codeblock.rb` file, then opened it and changed line 44 from

``` ruby
el.attr['class'] = "language-#{lang}" unless lang.empty?

```

to

``` ruby
el.attr['class'] = "language-#{lang} line-numbers" unless lang.empty?

```

Now every code block has the class of `line-numbers` added to it as well. 😀

After implementing prism.js, I noticed that there seemed to be an extra blank line added to the code blocks. This seems to be a [known bug](https://github.com/PrismJS/prism/issues/403), so I just downloaded the development version of prism.js (aka the unminified source) and changed the code to what is listing in the change [here](https://github.com/haarg/prism/commit/2e7409189114e14b940fc80fe8d22c0072114f48) as it has not yet been merged into the official prism.js code yet.

### Plugins & Building Locally

Because Github pages only supports a [few plugins](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/) and I wanted to use [this](http://charliepark.org/tags-in-jekyll/) tag plugin, I had to set it up so that Jekyll built the site locally, then I pushed that built version to my [darkle.github.io repository](https://github.com/Darkle/darkle.github.io). Doing this manually is a bit of a pain, but I stumbled on to [this neat article](http://spinhalf.net/2015/01/04/getting-started-with-a-jekyll-blog/) about using an [Alfred](http://www.alfredapp.com/) workflow to make things faster and easier.

Basically it allows you to create a new Jekyll post (including front-matter) with an shortcut in Alfred.

My Alfred workflow shortcuts look like this:

![Jekyll Alfred Screenshot](http://coopcoding.com/assets/images/blogpostimages/Jek-Alfred-ss2.png)

When I select a new blog post it runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/Coding/Projects/coopcoding.com/jekyll_files/
editor="MacDown.app"
extension=markdown

filename=$(echo $sitedir/_posts/blog/$(date +'%Y-%m-%d')-{query}.$extension | sed -e 's, ,-,g' | tr '[:upper:]' '[:lower:]')

cat <<EOT >> $filename
---
title: {query}
date: $(date +'%Y-%m-%d %H:%M:%S')
tags:[]
---

EOT
open -a "$editor" $filename
```

What this does is takes the title I gave it in Alfred and prepends the current date to that, then it creates a new file in the `_posts/blog/` directory and uses that title and date as the file name (Jekyll needs a `YEAR-MONTH-DAY-title.MARKUP` format for post file names). Then it adds the default front-matter for blog posts, plus the blog title that was specified by me in Alfred. It then opens that file in my markdown editor [Macdown.app](http://macdown.uranusjr.com/).

When I select a new project post it runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/Coding/Projects/coopcoding.com/jekyll_files/
editor="Whiskey.app"
extension=markdown

filename=$(echo $sitedir/_posts/projects/$(date +'%Y-%m-%d')-{query}.$extension | sed -e 's, ,-,g' | tr '[:upper:]' '[:lower:]')

cat <<EOT >> $filename
---
title: {query}
date: $(date +'%Y-%m-%d %H:%M:%S')
tags: []
summary:
---

EOT
open -a "$editor" $filename
```

which is pretty much the same except it creates the post in the `_posts/projects/` folder and it has a slightly different front-matter.

The "Build And Push To Github" runs the following bash commands:

``` bash
# Adjust these variables to your installation:

export PATH=/usr/local/bin:$PATH

JEKYLL_BLOG_DIRECTORY="/Users/username/Coding/Projects/coopcoding.com/jekyll_files/"

DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S')

cd $JEKYLL_BLOG_DIRECTORY
git add .
git commit -a -m "Post $DATE_TIME"
#check if there were any new files made on github
git pull --rebase
#push to github
git push origin master

terminal-notifier -title "Git Push for CoopCoding Jekyll Files Done" -message "" -open "https://github.com/Darkle/coopcoding.com_jekyll_version"

jekyll build

terminal-notifier -title "Jekyll Built Static Files" -message ""

STATIC_BLOG_DIRECTORY="/Users/username/Coding/Projects/coopcoding.com/darkle.github.io/"

cd $STATIC_BLOG_DIRECTORY
git add .
git commit -a -m "Post $DATE_TIME"
git push origin master

terminal-notifier -title "Git Push for CoopCoding Static Files Done" -message "" -open "https://github.com/Darkle/darkle.github.io"
```

This adds all files/new files to the git repository in my jekyll files folder. Then commits the change(s) to the repository with a message that includes the date and time. Then it checks to see if there were any changes made from somewhere else, then it pushes to github.

Next, jekyll builds the static site, then the script adds files to the static git repository, commits and pushes to github.

Originally I was going to use the default notifier for OSX in the bash script to notify me when the git pushes and the jekyll build was finished but it wasn't working for me, so I used this library insted: [https://github.com/alloy/terminal-notifier](https://github.com/alloy/terminal-notifier). Note: the bash shell jekyll uses didn't seem to load my default `.bash_profile` file automatically, so I had to manually put in `export PATH=/usr/local/bin:$PATH` so that it could see the terminal-notifier library I had installed via homebrew.

The "Open Blog Post" runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/Coding/Projects/coopcoding.com/jekyll_files/
extension=markdown

IFS=$'\n'

files=$(find $sitedir/_posts/blog -iname "*.$extension" | xargs ls -r |perl -MHTML::Entities -CS -pe'$_ = encode_entities($_, q{&<>"'\''})')

echo "<?xml version='1.0'?><items>"
for file in ${files}; do
	echo "<item uuid='file' arg='${file}' type='file'>"
	echo "<title>$(basename ${file})</title>"
	echo "<subtitle>${file}</subtitle>"
	echo "<icon type='fileicon'>${file}</icon>"
	echo "</item>"
done
echo "</items>"
fi
```

What this does is iterate through all of the files in the `_posts/blog` directory and then list them in Alfred. When you select which file you want, Alfred then opens that file in the markdown editor.

You can grab my Alfred workflow [here](https://drive.google.com/file/d/0B2rOnFGX-QzGZUx3aTVicmpnbU0/view?usp=sharing).


<DL><p>
<DT><A HREF="http://www.donationcoder.com/forum/index.php?topic=24939.0" ADD_DATE="1400468812" PRIVATE="1" TAGS="">StartSSL.com Certificate Provider: Mini-Review - DonationCoder.com</A>
<DT><A HREF="http://chrome-extension-downloader.com/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Start | Chrome Extension Downloader</A>
<DT><A HREF="http://ohlife.com/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">OhLife helps you remember what&#39;s happened in your life</A>
<DT><A HREF="http://keit.co/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">keit | odzyskiwanie haseł</A>
<DT><A HREF="http://www.sordum.org/8125/firewall-app-blocker-fab-v1-3/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Firewall App Blocker | Sordum.org</A>
<DT><A HREF="http://www.privacyware.com/personal_firewall.html" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Unknown title</A>
<DT><A HREF="http://auphonic.com/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">auphonic</A>
<DT><A HREF="https://gist.github.com/cfj/9841823" ADD_DATE="1400468812" PRIVATE="1" TAGS="">console.clog</A>
<DT><A HREF="http://zennolab.com/en/products/zennoposter/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">ZennoPoster 5 | ZennoLab.comZennoLab.com</A>
<DT><A HREF="http://pagefair.com/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">PageFair - Reclaim Your Adblocked Revenue</A>
<DT><A HREF="https://startpage.com/eng/?" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Startpage Search Engine</A>
<DT><A HREF="https://github.com/Jahaja/psdash" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Jahaja/psdash · GitHub</A>
<DT><A HREF="http://www.1-4a.com/datestat/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Freeware Date difference (=age) calculator. Shows difference between 2 dates in many ways</A>
<DT><A HREF="http://www.portablefreeware.com/index.php?id=2531" ADD_DATE="1400468812" PRIVATE="1" TAGS="">The Portable Freeware Collection - QiPress</A>
<DT><A HREF="http://www.portablefreeware.com/index.php?id=2583" ADD_DATE="1400468812" PRIVATE="1" TAGS="">The Portable Freeware Collection - DayDiff</A>
<DT><A HREF="http://www.shotcut.org/bin/view/Shotcut/Tutorials" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Tutorials &lt; Shotcut &lt; MLT Framework</A>
<DT><A HREF="http://www.videohelp.com/tools/Video-Container-Changer" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Video Container Changer 1.1</A>
<DT><A HREF="http://www.portablefreeware.com/index.php?id=2510" ADD_DATE="1400468812" PRIVATE="1" TAGS="">The Portable Freeware Collection - SterJo NetStalker</A>
<DT><A HREF="http://www.donationcoder.com/forum/index.php?topic=34427.0" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Mini review of Helpinator 3.10 - DonationCoder.com</A>
<DT><A HREF="http://www.ilovefreesoftware.com/20/webware/free-websites-take-screenshot-full-webpage-online.html" ADD_DATE="1400468812" PRIVATE="1" TAGS="">6 Free Websites To Take Screenshot of Full Webpage Online || Free Software</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/foundit/kckobojmajgneicjgbpcccionajfobbo?hl=en-US" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Chrome Web Store - Foundit</A>
<DT><A HREF="http://lifehacker.com/5935863/five-best-vpn-service-providers/1552324704/+alanhenry" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Most Popular VPN Service Provider: Private Internet Access</A>
<DT><A HREF="http://www.rlvision.com/genius/about.asp" ADD_DATE="1400468812" PRIVATE="1" TAGS="">Replace Genius - Automated Text &amp; Data Processing Freeware</A>
<DT><A HREF="http://useresponse.net/" ADD_DATE="1400468812" PRIVATE="1" TAGS="">UR - Demo Server</A>
<DT><A HREF="http://www.datingnumber.com/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Dating Number</A>
<DT><A HREF="http://getsoloapp.com/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Solo. Project Management for Freelancers</A>
<DT><A HREF="https://www.evernote.com/shard/s272/sh/8aada30e-611a-4d0d-93d0-211fb1e74d7e/5b1e1fba028f1a615c53e2a3d4a0612c" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Swappel&#39;s Master resource list</A>
<DT><A HREF="http://www.radiumcrm.com/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Radium CRM - The CRM built for Gmail</A>
<DT><A HREF="http://resp.in/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">re/spin | Import any Last.fm or Spotify playlist into Rdio for free</A>
<DT><A HREF="http://www.blinkmailapp.com/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Blink Mail</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/my-code-stockcom/bnlabgojebipbkffbebpecgapkakdikp" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Chrome Web Store - my code stock.com</A>
<DT><A HREF="http://www.pickywallpapers.com/abstract/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Abstract Pictures Category: HD, Wide, iPhone, iPad Abstract Wallpapers, Kindle Abstract Screensavers, Blackberry Abstract Wallpapers</A>
<DT><A HREF="http://www.itrush.com/human-voice-clarifying-amplifier-a-digital-earpiece-that-amplifies-human-voices-instead-of-no" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Human Voice Clarifying Amplifier - A digital earpiece that amplifies human voice frequencies instead of noise</A>
<DT><A HREF="http://www.metalsmith.io/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Metalsmith</A>
<DT><A HREF="http://www.getvideostream.com/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Videostream for Chromecast</A>
<DT><A HREF="https://monitorbook.com/" ADD_DATE="1409626602" PRIVATE="1" TAGS="">Monitorbook | Easily track anything on the web</A>
<DT><A HREF="http://www.reddit.com/r/startups/comments/20h738/need_stock_photos_for_your_start_up_this_should/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Need stock photos for your start up? This should help. : startups</A>
<DT><A HREF="http://www.softperfect.com/products/wifiguard/" ADD_DATE="1409632395" PRIVATE="1" TAGS="">SoftPerfect WiFi Guard : keep your Wi-Fi network secure</A>
<DT><A HREF="http://reme.io/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Create email reminders in seconds - Reme.IO</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/minimalist-for-everything/bmihblnpomgpjkfddepdpdafhhepdbek?hl=en-US" ADD_DATE="1400468841" PRIVATE="1" TAGS="">Chrome Web Store - Minimalist for Everything</A>
<DT><A HREF="http://www.makeuseof.com/tag/11-chrome-extensions-that-will-super-power-your-gmail-experience/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">11 Chrome Extensions That Will Super-Power Your Gmail Experience</A>
<DT><A HREF="http://whatsonmypc.wordpress.com/2014/02/13/geeksqueaks-204/" ADD_DATE="1400468841" PRIVATE="1" TAGS="">GEEK SQUEAKS – Featuring A Windows-Based Portable App Tool For Updating Windows | What&#39;s On My PC</A>
<DT><A HREF="http://bugmuncher.com/" ADD_DATE="1400469092" PRIVATE="1" TAGS="">BugMuncher - Feedback Tab Widget for Websites</A>
<DT><A HREF="http://99tests.com/" ADD_DATE="1400469153" PRIVATE="1" TAGS="">99tests Software Testing Community</A>
<DT><A HREF="http://www.trankynam.com/xtrafinder/" ADD_DATE="1400469189" PRIVATE="1" TAGS="">XtraFinder adds Tabs and features to Mac Finder.</A>
<DT><A HREF="https://stamplay.com/" ADD_DATE="1400469215" PRIVATE="1" TAGS="">Stamplay | Connect. Automate. Invent.</A>
<DT><A HREF="http://www.inkba.com/" ADD_DATE="1400469250" PRIVATE="1" TAGS="">Inkba</A>
<DT><A HREF="http://thenightlight.com/" ADD_DATE="1400469327" PRIVATE="1" TAGS="">The Nightlight</A>
<DT><A HREF="http://tweekly.net/" ADD_DATE="1400469354" PRIVATE="1" TAGS="">Weekly Twitter Email Digests | Tweekly</A>
<DT><A HREF="http://www.cardpool.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Gift Card Exchange - Buy, Sell, and Trade Gift Cards Online | Cardpool</A>
<DT><A HREF="https://itunes.apple.com/us/app/remote-potato/id378287173?mt=8" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Remote Potato on the App Store on iTunes</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/videostream-for-google-ch/cnciopoikihiagdjbjpnocolokfelagl?hl=en" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Chrome Web Store - Videostream for Google Chromecast™</A>
<DT><A HREF="http://www.binarynights.com/locko/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Locko - Password manager and file vault</A>
<DT><A HREF="https://www.indiegogo.com/projects/tethercell-control-battery-operated-devices-from-your-smartphone-or-tablet#home" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Tethercell: Control Battery-Operated Devices from Your Smartphone or Tablet | Indiegogo</A>
<DT><A HREF="http://www.mobileciti.com.au/mobile-phones?limit=all" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Mobile Phones - Cheap &amp; Unlocked! Buy Online | MobileCiti</A>
<DT><A HREF="http://albumsyncer.jyothepro.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">AlbumSyncer</A>
<DT><A HREF="http://beamer-app.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Beamer – Stream any movie file from your Mac to Apple TV</A>
<DT><A HREF="https://mote.io/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Mote.io - The Website Remote</A>
<DT><A HREF="https://www.sideprojectors.com/project/home" ADD_DATE="1400469749" PRIVATE="1" TAGS="">SideProjectors | Marketplace to buy and sell side projects.</A>
<DT><A HREF="http://www.oneqstn.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">OneQstn: Super Simple Surveys - Home</A>
<DT><A HREF="http://macappstudio.com/socialfan/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Social Fan</A>
<DT><A HREF="http://www.piranhas.co/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Piranhas - Compare book prices</A>
<DT><A HREF="http://slowyapp.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Slowy app | Real-world connection simulator and bandwidth limiter</A>
<DT><A HREF="http://www.lettersofnote.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Letters of Note</A>
<DT><A HREF="http://theamericanscholar.org/what-killed-my-sister/?key=55917458" ADD_DATE="1400469749" PRIVATE="1" TAGS="">The American Scholar: What Killed My Sister? - Priscilla Long</A>
<DT><A HREF="http://www.pcmag.com/article2/0,2817,2393941,00.asp" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Onavo Extend (for iPhone) Review &amp; Rating | PCMag.com</A>
<DT><A HREF="https://twoople.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Twoople</A>
<DT><A HREF="http://www.pcmag.com/article2/0,2817,2402169,00.asp" ADD_DATE="1400469749" PRIVATE="1" TAGS="">The 10 Best Gaming Monitors | PCMag.com</A>
<DT><A HREF="http://recurify.co/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Recurify - Make Every Order A Recurring Order!</A>
<DT><A HREF="http://apps.evozi.com/apk-downloader/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">APK Downloader [Latest] Download Directly | Chrome Extension v2.1.2 (Evozi Official)</A>
<DT><A HREF="http://www.smartpassiveincome.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">The Smart Passive Income Blog — Smart Ways to Live a Passive Income Lifestyle On the Internet with SmartPassiveIncome.com</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/apk-downloader/obhlfmheblhjhkmacldlhdnbgbaiigba" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Chrome Web Store - APK Downloader</A>
<DT><A HREF="http://superuser.com/questions/420343/how-to-synchronize-directories-outside-the-google-drive-directory" ADD_DATE="1400469749" PRIVATE="1" TAGS="">windows - How to synchronize directories outside the Google Drive directory - Super User</A>
<DT><A HREF="http://www.addictivetips.com/ios/get-data-usage-under-control-on-your-iphone/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Get Data Usage Under Control On Your iPhone</A>
<DT><A HREF="http://www.panabee.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Business Name Generator &amp; Domain Name Search</A>
<DT><A HREF="http://www.getkanvas.com/" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Welcome to Kanvas</A>
<DT><A HREF="http://www.amazon.com/exec/obidos/ASIN/B003UYUP58/ref=nosim/0sil8" ADD_DATE="1400469749" PRIVATE="1" TAGS="">Amazon.com: The Emperor of All Maladies: A Biography of Cancer eBook: Siddhartha Mukherjee: Kindle Store</A>
<DT><A HREF="http://www.bookmarks4techs.com/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Bookmarks4Techs - Bookmarks4Techs</A>
<DT><A HREF="http://www.reddit.com/r/SideProject/comments/22pt8h/feedback_request_ideabacker/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Feedback Request: IdeaBacker : SideProject</A>
<DT><A HREF="http://atomisystems.com/activepresenter/free-edition/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Free Edition - Advanced Screencast &amp; Rapid eLearning Authoring Tool</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/gif-scrubber/gbdacbnhlfdlllckelpdkgeklfjfgcmp/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Chrome Web Store - GIF Scrubber</A>
<DT><A HREF="http://www.loper-os.org/?p=284" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Loper OS » Seven Laws of Sane Personal Computing</A>
<DT><A HREF="http://www.reddit.com/r/software/comments/238kpi/new_audio_format_and_player_let_me_know_what_you/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">New Audio format and player, let me know what you think. : software</A>
<DT><A HREF="http://www.shotcut.org/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">WebHome &lt; Shotcut &lt; MLT Framework</A>
<DT><A HREF="https://abine.com/maskme/faq/#whatisit" ADD_DATE="1400469787" PRIVATE="1" TAGS="">MaskMe Frequently Asked Questions</A>
<DT><A HREF="http://www.reddit.com/r/SideProject/comments/22sjw7/signupsio_turn_any_web_page_into_a_sign_up_form/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Signups.io - Turn any web page into a sign up form : SideProject</A>
<DT><A HREF="https://github.com/play/play" ADD_DATE="1400469787" PRIVATE="1" TAGS="">play/play · GitHub</A>
<DT><A HREF="http://brokenforum.com/index.php" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Broken Forum</A>
<DT><A HREF="https://abine.com/maskme/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">MaskMe - Block Spam With Disposable Emails And Protect Your Passwords</A>
<DT><A HREF="http://pluto.tv/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Pluto.TV | Watch What&#39;s Possible</A>
<DT><A HREF="http://www.freenom.com/en/index.html" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Freenom.com</A>
<DT><A HREF="http://cards.cinelinx.com/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Cinelinx Card Game - A card game for movie people.</A>
<DT><A HREF="http://www.getanysend.com/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Any Send</A>
<DT><A HREF="http://misswallflower.tumblr.com/post/83418987079" ADD_DATE="1400469787" PRIVATE="1" TAGS="">.la douleur exquise. - I hold this to be the highest task of a bond...</A>
<DT><A HREF="http://podgallery.org/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Podcast Gallery - The Best Audio and Video Podcasts</A>
<DT><A HREF="http://reflectivecode.com/gminder/" ADD_DATE="1400469787" PRIVATE="1" TAGS="">GMinder – Desktop Reminder for Google Calendar | Reflective Code</A>
<DT><A HREF="http://apps.simonpaarlberg.com/x/sn_twitter.html" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Security Now and Steve Gibsons Twitter stream combined</A>
<DT><A HREF="http://linoxide.com/guide/linux-command-shelf.html" ADD_DATE="1400469787" PRIVATE="1" TAGS="">Linux Commands In Structured Order with Detailed Reference | LinOxide</A>
<DT><A HREF="http://aosabook.org/en/index.html" ADD_DATE="1400469787" PRIVATE="1" TAGS="">The Architecture of Open Source Applications</A>
<DT><A HREF="https://web.archive.org/web/20131118134450/http://silvanolte.com/blog/2011/01/18/do-you-want-the-application-to-accept-incoming-network-connections/" ADD_DATE="1417231845" PRIVATE="1" TAGS="">Do you want the application to accept incoming network connections? | The λ♥[love] Blog</A>
<DT><A HREF="http://www.portablefreeware.com/index.php?id=1899" ADD_DATE="1395799680" PRIVATE="1" TAGS="">The Portable Freeware Collection - VNCHelper</A>
<DT><A HREF="https://tails.boum.org/" ADD_DATE="1395806098" PRIVATE="1" TAGS="">Tails - Privacy for anyone anywhere</A>
<DT><A HREF="http://www.petpoc.com/" ADD_DATE="1416787734" PRIVATE="1" TAGS="">Petpoc – Keep your pets in your pocket</A>
<DT><A HREF="http://www.colasoft.com/download/products/capsa_free.php" ADD_DATE="1395355164" PRIVATE="1" TAGS="">Download Capsa Free Network Analyzer - Colasoft</A>
<DT><A HREF="http://www.calorieking.com.au/" ADD_DATE="1395361898" PRIVATE="1" TAGS="">Australian Online Diet and weight loss club. Lose weight for good!</A>
<DT><A HREF="http://www.hodinkee.com/?category=A%20Week%20On%20The%20Wrist" ADD_DATE="1395362927" PRIVATE="1" TAGS="">HODINKEE - Wristwatch News, Reviews, &amp; Original Stories</A>
<DT><A HREF="http://outgrow.me/" ADD_DATE="1395362772" PRIVATE="1" TAGS="">Outgrow.me - The Crowdfunding Marketplace</A>
<DT><A HREF="http://goodnoows.com/" ADD_DATE="1395365225" PRIVATE="1" TAGS="">Good News</A>
<DT><A HREF="http://www.getepic.com/" ADD_DATE="1395382454" PRIVATE="1" TAGS="">Epic! - Books for Kids</A>
<DT><A HREF="http://www.lobotomo.com/products/WinShortcutter/" ADD_DATE="1409995856" PRIVATE="1" TAGS="">Lobotomo Software: WinShortcutter</A>
<DT><A HREF="http://scotch.io/bar-talk/designing-a-restful-web-api" ADD_DATE="1410060693" PRIVATE="1" TAGS="">Designing a RESTful web API ♥ Scotch</A>
<DT><A HREF="https://www.kickstarter.com/projects/804149834/teo-the-future-of-the-padlock-is-here?ref=category" ADD_DATE="1395711140" PRIVATE="1" TAGS="">TEO: The future of the padlock is here. by OckCorp — Kickstarter</A>
<DT><A HREF="http://www.indiegogo.com/projects/otto-petcare-systems-for-dogs-and-cats" ADD_DATE="1395712269" PRIVATE="1" TAGS="">Otto Petcare Systems for dogs and cats | Indiegogo</A>
<DT><A HREF="https://www.kickstarter.com/projects/957745871/arq-dock-iphone-5s-5c-5-ipad-ipad-mini-s4-s5-note" ADD_DATE="1395712715" PRIVATE="1" TAGS="">Arq Dock: iPhone 5S 5C 5 iPad iPad Mini S4 S5 Note Android by B&amp;A Studio — Kickstarter</A>
<DT><A HREF="https://www.kickstarter.com/projects/1506707629/leaf-mount-collapsible-stand-for-ipads-androids-an" ADD_DATE="1395712732" PRIVATE="1" TAGS="">Léaf Mount: Collapsible Stand for Ipads, Androids &amp; Iphones by Tajudeen Bisiriyu &amp; Léaf Inc — Kickstarter</A>
<DT><A HREF="https://www.kickstarter.com/projects/lumio/lumio-one-lamp-multiple-forms-infinite-possibiliti?ref=discovery" ADD_DATE="1395718218" PRIVATE="1" TAGS="">Lumio: A Modern Lamp With Infinite Possibilities by Max Gunawan — Kickstarter</A>
<DT><A HREF="http://beta.freecode.com/projects/etm" ADD_DATE="1395719500" PRIVATE="1" TAGS="">Event and Task Manager – Freecode</A>
<DT><A HREF="http://www.donationcoder.com/forum/index.php?topic=36168.0" ADD_DATE="1395725244" PRIVATE="1" TAGS="">NANY 2014 Pledge: xbmcsender - DonationCoder.com</A>
<DT><A HREF="http://stefanstools.sourceforge.net/CryptSync.html" ADD_DATE="1395727249" PRIVATE="1" TAGS="">CryptSync - Stefan&#39;s Tools</A>
<DT><A HREF="https://crowdin.net/" ADD_DATE="1395460793" PRIVATE="1" TAGS="">Localization Management Platform · Crowdin</A>
<DT><A HREF="http://freemusicarchive.org/" ADD_DATE="1395487144" PRIVATE="1" TAGS="">Free Music Archive</A>
<DT><A HREF="http://www.abc.net.au/news/vic-election-2014/vote-compass/" ADD_DATE="1416966680" PRIVATE="1" TAGS="">Vote Compass - ABC News (Australian Broadcasting Corporation)</A>
<DT><A HREF="http://bop.fm/" ADD_DATE="1395546503" PRIVATE="1" TAGS="">bop.fm</A>
<DT><A HREF="http://www.ghacks.net/2014/03/11/dvdfab-domains-seized-alternatives/" ADD_DATE="1395626979" PRIVATE="1" TAGS="">DVDFab domains seized: here are some alternatives | gHacks Technology News</A>
<DT><A HREF="http://www.donationcoder.com/Software/Mouser/wlc/index.html" ADD_DATE="1395633092" PRIVATE="1" TAGS="">Web Link Captor - Mouser - Software - DonationCoder.com</A>
<DT><A HREF="https://github.com/andr3jx/RTMPExploreX" ADD_DATE="1395631985" PRIVATE="1" TAGS="">andr3jx/RTMPExploreX 路 GitHub</A>
<DT><A HREF="http://www.donationcoder.com/Software/Mouser/findrun/index.html" ADD_DATE="1395635117" PRIVATE="1" TAGS="">FARR (Find And Run Robot) - Mouser - Software - DonationCoder.com</A>
<DT><A HREF="http://skwire.dcmembers.com/fp/?page=earl" ADD_DATE="1395635927" PRIVATE="1" TAGS="">Skwire Empire » Earl</A>
<DT><A HREF="http://www.naminum.com/" ADD_DATE="1417130104" PRIVATE="1" TAGS="">Naminum - The ultimate company name, startup name and website name on the web</A>
<DT><A HREF="http://framerjs.com/" ADD_DATE="1417130777" PRIVATE="1" TAGS="">Framer - Prototype Interaction and Animation</A>
<DT><A HREF="https://gist.github.com/magnetikonline/5274656" ADD_DATE="1419410926" PRIVATE="1" TAGS="">IE 7/8/9/10/11 Virtual machines from Microsoft - Linux w/VirtualBox installation notes.</A>
<DT><A HREF="http://www.studioneat.com/products/neaticekit" ADD_DATE="1418335578" PRIVATE="1" TAGS="">Neat Ice Kit – Studio Neat</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/advancedsearch/kiojigpmlalkpficggecipbmchnneldc" ADD_DATE="1418420828" PRIVATE="1" TAGS="">AdvancedSearch - Chrome Web Store</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/channels-for-netflix/ikfbeibdgkppafgfgegkelkjnadflifa?hl=en" ADD_DATE="1419140843" PRIVATE="1" TAGS="">Channels for Netflix - Chrome Web Store</A>
<DT><A HREF="http://things.gnod.com/smartphones/" ADD_DATE="1419063290" PRIVATE="1" TAGS="">Gnod Smartphone Comparison Chart</A>
<DT><A HREF="https://itunes.apple.com/us/app/wakie-social-alarm-clock/id879488038?mt=8" ADD_DATE="1418773004" PRIVATE="1" TAGS="">Wakie - Social Alarm Clock on the App Store on iTunes</A>
<DT><A HREF="https://www.youtube.com/watch?v=Tt8eW_AhFZU" ADD_DATE="1418889257" PRIVATE="1" TAGS="">Why You&#39;re Wrong About Top Gun - by LA Weekly&#39;s Amy Nicholson - YouTube</A>
<DT><A HREF="https://www.everalbum.com/" ADD_DATE="1400925588" PRIVATE="1" TAGS="">Everalbum</A>
<DT><A HREF="http://clickontyler.com/virtualhostx/" ADD_DATE="1417478609" PRIVATE="1" TAGS="">VirtualHostX - Create and Share Virtual Hosts on your Mac</A>
<DT><A HREF="http://www.psequel.com/" ADD_DATE="1417471030" PRIVATE="1" TAGS="">PSequel, a PostgreSQL GUI Tool for Mac OS X</A>
<DT><A HREF="http://softorino.com/waltr" ADD_DATE="1417838127" PRIVATE="1" TAGS="">Waltr | Softorino Inc.</A>
<DT><A HREF="http://angryip.org/" ADD_DATE="1395724958" PRIVATE="1" TAGS="">Home - Angry IP Scanner</A>
<DT><A HREF="http://www.pixa-app.com/" ADD_DATE="1410308106" PRIVATE="1" TAGS="">Pixa - organizing your images, the easy way</A>
<DT><A HREF="http://macaw.co/" ADD_DATE="1420336371" PRIVATE="1" TAGS="">Macaw: The Code-Savvy Web Design Tool</A>
<DT><A HREF="https://inlinemanual.com/" ADD_DATE="1420341056" PRIVATE="1" TAGS="">InlineManual.com</A>
<DT><A HREF="http://www.cloudidentity.com/blog/2013/01/02/oauth-2-0-and-sign-in-4/" ADD_DATE="1420354457" PRIVATE="1" TAGS="">OAuth 2.0 and Sign-In | CloudIdentity</A>
<DT><A HREF="http://digidyn.blogspot.com.au/" ADD_DATE="1415854651" PRIVATE="1" TAGS="">Digital Dyanmic</A>
<DT><A HREF="http://www.shitexpress.com/" ADD_DATE="1416025164" PRIVATE="1" TAGS="">Shitexpress · Send a shit in a box to someone, stay anonymous, pay with Bitcoin/PayPal</A>
<DT><A HREF="https://itunes.apple.com/us/app/hooks-alerts-that-matter/id923353363" ADD_DATE="1416026135" PRIVATE="1" TAGS="">Hooks - Alerts for Everything. Notifications for Sports &amp; TV &amp; Stock &amp; Weather &amp; More on the App Store on iTunes</A>
<DT><A HREF="http://www.vidfoundry.com/" ADD_DATE="1416026168" PRIVATE="1" TAGS="">VidFoundry | Professional Explainer Videos &amp; YouTube Ads for $199</A>
<DT><A HREF="http://takeyourvideo.com/" ADD_DATE="1416026177" PRIVATE="1" TAGS="">TakeYourVideo | Explainer Video |Animated marketing video | - Best Animated Explainer Video for your Business at the best Rates.</A>
<DT><A HREF="https://github.com/sanbor/printable-calendar" ADD_DATE="1419760175" PRIVATE="1" TAGS="">sanbor/printable-calendar · GitHub</A>
<DT><A HREF="http://h264enc.sourceforge.net/" ADD_DATE="1421009933" PRIVATE="1" TAGS="">h264enc - Configuring Encoder</A>
<DT><A HREF="http://www.xstockvideo.com/" ADD_DATE="1421024382" PRIVATE="1" TAGS="">XStockvideo</A>
<DT><A HREF="http://www.videohelp.com/tools/FLV-Extract" ADD_DATE="1421027563" PRIVATE="1" TAGS="">FLV Extract 1.6.4 / 2.2.0 jofori89</A>
<DT><A HREF="https://github.com/philipwalton/flexbugs" ADD_DATE="1421541974" PRIVATE="1" TAGS="">philipwalton/flexbugs · GitHub</A>
<DT><A HREF="https://github.com/groupon/greenscreen" ADD_DATE="1421556108" PRIVATE="1" TAGS="">groupon/greenscreen 路 GitHub</A>
<DT><A HREF="http://curl.trillworks.com/" ADD_DATE="1421194194" PRIVATE="1" TAGS="">Convert curl command syntax to python requests code</A>
<DT><A HREF="http://ranger.nongnu.org/" ADD_DATE="1421200599" PRIVATE="1" TAGS="">ranger</A>
<DT><A HREF="https://cluster.co/" ADD_DATE="1401249620" PRIVATE="1" TAGS="">Cluster | Private spaces for you and your friends.</A>
<DT><A HREF="https://github.com/Yelp/osxcollector" ADD_DATE="1411183194" PRIVATE="1" TAGS="">Yelp/osxcollector Âˇ GitHub</A>
<DT><A HREF="https://sensortower.com/" ADD_DATE="1401270800" PRIVATE="1" TAGS="">Sensor Tower - App Marketing and Mobile SEO Keyword Optimization for iPhone and iPad iPhone &amp; iPad iTunes App Store Keyword Tracking</A>
<DT><A HREF="https://github.com/mmccaff/PlacesToPostYourStartup" ADD_DATE="1411188726" PRIVATE="1" TAGS="">mmccaff/PlacesToPostYourStartup Âˇ GitHub</A>
<DT><A HREF="http://wistia.com/" ADD_DATE="1411197695" PRIVATE="1" TAGS="">Video Hosting for Business</A>
<DT><A HREF="https://uptimerobot.com/" ADD_DATE="1411199351" PRIVATE="1" TAGS="">Uptime Robot</A>
<DT><A HREF="http://gridzzly.com/" ADD_DATE="1410658837" PRIVATE="1" TAGS="">Gridzzly.com - Make your own grid paper.</A>
<DT><A HREF="https://projectparfait.adobe.com/" ADD_DATE="1410660140" PRIVATE="1" TAGS="">Project Parfait (Beta) - PSD CSS Extraction, Measurements and Image Optimization Service for the Web</A>
<DT><A HREF="https://blogtrottr.com/" ADD_DATE="1401325278" PRIVATE="1" TAGS="">Free realtime RSS and Atom feed to email service. Get your favourite blogs, feeds, and news delivered to your inbox.</A>
<DT><A HREF="http://thestocks.im/" ADD_DATE="1411099251" PRIVATE="1" TAGS="">TheStocks.im best royalty free stock photos in one place</A>
<DT><A HREF="http://www.leancrew.com/all-this/2014/05/a-little-sips/" ADD_DATE="1401341765" PRIVATE="1" TAGS="">A little sips - All this</A>
<DT><A HREF="http://baymard.com/blog/faceted-sorting" ADD_DATE="1411111453" PRIVATE="1" TAGS="">Faceted Sorting - A New Method for Sorting Search Results - Articles - Baymard Institute</A>
<DT><A HREF="https://github.com/jipegit/OSXAuditor" ADD_DATE="1411120691" PRIVATE="1" TAGS="">jipegit/OSXAuditor · GitHub</A>
<DT><A HREF="https://webflow.com/" ADD_DATE="1410839025" PRIVATE="1" TAGS="">Webflow - Top Responsive Website Builder</A>
<DT><A HREF="https://play.google.com/store/apps/details?id=com.arf.weatherstation" ADD_DATE="1401232365" PRIVATE="1" TAGS="">Weather Station - Android Apps on Google Play</A>
<DT><A HREF="http://security.stackexchange.com/questions/211/how-to-securely-hash-passwords" ADD_DATE="1411778936" PRIVATE="1" TAGS="">appsec - How to securely hash passwords? - Information Security Stack Exchange</A>
<DT><A HREF="https://github.com/2ndalpha/gasmask" ADD_DATE="1422514688" PRIVATE="1" TAGS="">2ndalpha/gasmask 路 GitHub</A>
<DT><A HREF="https://news.ycombinator.com/item?id=7673628" ADD_DATE="1401511406" PRIVATE="1" TAGS="">A free cookbook for people living on $4/day | Hacker News</A>
<DT><A HREF="http://yimello.adriencadet.com/" ADD_DATE="1411871565" PRIVATE="1" TAGS="">Yimello</A>
<DT><A HREF="https://resnip.com/" ADD_DATE="1412760036" PRIVATE="1" TAGS="">Resnip: Link to any section on a webpage</A>
<DT><A HREF="https://bookofbadarguments.com/?utm_source=hackernewsletter&amp;utm_medium=email&amp;utm_term=books" ADD_DATE="1411450366" PRIVATE="1" TAGS="">An Illustrated Book of Bad Arguments</A>
<DT><A HREF="https://itunes.apple.com/app/id870659406?mt=12" ADD_DATE="1401600270" PRIVATE="1" TAGS="">Mac App Store - Stache</A>
<DT><A HREF="https://yttr.co/" ADD_DATE="1412560032" PRIVATE="1" TAGS="">Yttr</A>
<DT><A HREF="http://dogvacay.com/how-it-works" ADD_DATE="1412763582" PRIVATE="1" TAGS="">How Does Dog Boarding Work | DogVacay</A>
<DT><A HREF="http://www.foldingtext.com/" ADD_DATE="1402095299" PRIVATE="1" TAGS="">FoldingText — Plain text productivity for Mac users</A>
<DT><A HREF="http://www.gkogan.co/blog/ugly-ad-saved-business/" ADD_DATE="1411524580" PRIVATE="1" TAGS="">This Ugly Ad Saved My Business - Grigoriy Kogan</A>
<DT><A HREF="http://allthefreestock.com/" ADD_DATE="1412634888" PRIVATE="1" TAGS="">Free Stock Images &amp; Videos ~ AllTheFreeStock.com</A>
<DT><A HREF="http://www.irradiatedsoftware.com/labs/" ADD_DATE="1411643456" PRIVATE="1" TAGS="">Irradiated Software - Labs - Beta Tested - Gamma Blasted</A>
<DT><A HREF="http://getstache.com/" ADD_DATE="1401751716" PRIVATE="1" TAGS="">Stache - A smarter way to bookmark web pages for Mac, iPhone and iPad</A>
<DT><A HREF="http://www.jsnice.org/" ADD_DATE="1401783487" PRIVATE="1" TAGS="">JS NICE: Statistical renaming, Type inference and Deobfuscation</A>
<DT><A HREF="http://www.ghacks.net/2014/09/30/alt-tab-taking-forever-while-playing-games-borderless-gaming-comes-to-the-rescue/" ADD_DATE="1412137610" PRIVATE="1" TAGS="">Alt-Tab taking forever while playing games? Borderless Gaming comes to the rescue - gHacks Tech News</A>
<DT><A HREF="http://blog.definedcode.com/osx-qemu-kvm" ADD_DATE="1401929762" PRIVATE="1" TAGS="">Running OS X Mavericks under QEMU with KVM</A>
<DT><A HREF="http://www.amazon.com/dp/B001I46060?tag=lifehackeramzn-20&amp;ascsubtag=[referrer|popurls.com[type|link[postId|1584870014[asin|B001I46060[authorId|5727177402741770316" ADD_DATE="1401933641" PRIVATE="1" TAGS="">Amazon.com : PetSafe Pawz Away Mat, 12-By-60-Inch : Pet Insect Repellents : Pet Supplies</A>
<DT><A HREF="https://github.com/busyloop/maclight" ADD_DATE="1422434745" PRIVATE="1" TAGS="">busyloop/maclight 路 GitHub</A>
<DT><A HREF="http://www.hemingwayapp.com/" ADD_DATE="1402035952" PRIVATE="1" TAGS="">Hemingway</A>
<DT><A HREF="http://mp3splt.sourceforge.net/mp3splt_page/home.php" ADD_DATE="1411722139" PRIVATE="1" TAGS="">mp3, ogg vorbis and FLAC splitter - mp3splt-project</A>
<DT><A HREF="http://www.minefile.info/" ADD_DATE="1411725132" PRIVATE="1" TAGS="">Mine</A>
<DT><A HREF="http://kxstudio.sourceforge.net/" ADD_DATE="1401944027" PRIVATE="1" TAGS="">KXStudio</A>
<DT><A HREF="http://sourceforge.net/apps/mediawiki/sleepyhead/index.php?title=Main_Page" ADD_DATE="1401947695" PRIVATE="1" TAGS="">SourceForge.net: sleepyhead</A>
<DT><A HREF="http://sourceforge.net/projects/mp4joiner/?source=blog" ADD_DATE="1401947735" PRIVATE="1" TAGS="">MP4Joiner | Free Audio &amp; Video software downloads at SourceForge.net</A>
<DT><A HREF="http://www.raymond.cc/blog/10-commercial-disk-imaging-software-features-and-backuprestore-speed-comparison/?utm_source=feedburner&amp;utm_medium=feed&amp;utm_campaign=Feed%3A+RaymondccBlog+%28Raymond.CC+Blog%29" ADD_DATE="1395180844" PRIVATE="1" TAGS="">Comparing 20 Drive Imaging Software Backup/Restore Speed and Image Size • Raymond.CC</A>
<DT><A HREF="https://www.jamieoliver.com/recipes/category/books/jamie-s-15-minute-meals" ADD_DATE="1395193527" PRIVATE="1" TAGS="">Jamie&#39;s 15-Minute Meals Recipes | Jamie Oliver Recipes</A>
<DT><A HREF="http://www.ut-team.com/mac-os-x/dvd-creator-pro-3" ADD_DATE="1416631979" PRIVATE="1" TAGS="">DVD Creator Pro 3 | UT Team</A>
<DT><A HREF="https://www.endorfyn.com/w/" ADD_DATE="1416633783" PRIVATE="1" TAGS="">Endorfyn | Everything You Like</A>
<DT><A HREF="http://linkvau.lt/" ADD_DATE="1393660221" PRIVATE="1" TAGS="">Create limited-download links to your digital content</A>
<DT><A HREF="https://www.secretlymeet.me/" ADD_DATE="1393657332" PRIVATE="1" TAGS="">SecretlyMeet.me - A line for your private encounters. Disposable websites, security for everyone.</A>
<DT><A HREF="https://wilwheaton.net/2014/02/ten-great-tabletop-games-you-can-use-to-introduce-your-friends-to-gaming/?utm_source=feedburner&amp;utm_medium=feed&amp;utm_campaign=Feed%3A+wwdn+%28WIL+WHEATON+dot+NET%29" ADD_DATE="1393718119" PRIVATE="1" TAGS="">Ten great Tabletop games you can use to introduce your friends to gaming | WIL WHEATON dot NET</A>
<DT><A HREF="http://www.fourhourworkweek.com/blog/2008/01/27/relax-like-a-pro-5-steps-to-hacking-your-sleep/" ADD_DATE="1393729972" PRIVATE="1" TAGS="">Relax Like A Pro: 5 Steps to Hacking Your Sleep</A>
<DT><A HREF="https://bmark.us/" ADD_DATE="1393730138" PRIVATE="1" TAGS="">Bookie: Welcome to Bookie</A>
<DT><A HREF="http://www.huffingtonpost.com/tim-ferriss/11-tricks-for-perfect-sle_b_2527454.html" ADD_DATE="1393729762" PRIVATE="1" TAGS="">Tim Ferriss: 11 Tricks for Perfect Sleep</A>
<DT><A HREF="http://super.cc/" ADD_DATE="1393752031" PRIVATE="1" TAGS="">Super.cc</A>
<DT><A HREF="http://www.resoph.com/ResophNotes/Welcome.html" ADD_DATE="1393889608" PRIVATE="1" TAGS="">ResophNotes - Quick Notes on Windows</A>
<DT><A HREF="http://torrentfreak.com/seriesguide-turns-chrome-browser-into-a-tv-torrent-tivo-140301/" ADD_DATE="1393992603" PRIVATE="1" TAGS="">SeriesGuide Turns Chrome Browser Into a TV Torrent TiVo | TorrentFreak</A>
<DT><A HREF="http://save-o-gram.com/" ADD_DATE="1394013103" PRIVATE="1" TAGS="">Save-o-gram Instagram Downloader | Download Instagram photos and videos</A>
<DT><A HREF="http://deskrail.com/" ADD_DATE="1394074153" PRIVATE="1" TAGS="">Desk Rail</A>
<DT><A HREF="http://www.elgato.com/en/gaming/game-capture-hd" ADD_DATE="1394073654" PRIVATE="1" TAGS="">Game Capture HD | elgato.com</A>
<DT><A HREF="http://www.tvshowtime.com/" ADD_DATE="1394150532" PRIVATE="1" TAGS="">TVShow Time - Welcome</A>
<DT><A HREF="http://masoncurrey.com/daily-rituals/" ADD_DATE="1394160151" PRIVATE="1" TAGS="">Daily Rituals - Mason Currey</A>
<DT><A HREF="http://www.nudgemail.com/how/" ADD_DATE="1394164161" PRIVATE="1" TAGS="">NudgeMail | How To</A>
<DT><A HREF="https://www.viabox.com/" ADD_DATE="1394163978" PRIVATE="1" TAGS="">Viaddress is now Viabox | The Global Leader in Package Forwarding</A>
<DT><A HREF="http://www.openallurls.com/" ADD_DATE="1394179308" PRIVATE="1" TAGS="">OpenAllURLs: Open multiple URLs/links at the same time</A>
<DT><A HREF="http://honestandroidgames.com/" ADD_DATE="1394179660" PRIVATE="1" TAGS="">Honest Android Games</A>
<DT><A HREF="http://coronalabs.com/" ADD_DATE="1394241727" PRIVATE="1" TAGS="">Cross-Platform Mobile App Development for iOS, Android - Corona Labs</A>
<DT><A HREF="http://www.ghacks.net/2014/03/01/browse-images-viewed-internet-imagecacheviewer/" ADD_DATE="1394245547" PRIVATE="1" TAGS="">Browse all images that you viewed on the Internet with ImageCacheViewer | gHacks Technology News</A>
<DT><A HREF="https://chrome.google.com/webstore/detail/http-switchboard/mghdpehejfekicfjcdbfofhcmnjhgaag?hl=en" ADD_DATE="1394239597" PRIVATE="1" TAGS="">Chrome Web Store - HTTP Switchboard</A>
<DT><A HREF="http://cinematography-howto.wonderhowto.com/" ADD_DATE="1394247871" PRIVATE="1" TAGS="">Cinematography - learn camera techniques and film lighting for movies « Wonder How To</A>
<DT><A HREF="http://www.askvg.com/wi-host-freeware-to-turn-your-windows-pc-or-laptop-into-wi-fi-host-spot-to-share-internet-connection/" ADD_DATE="1394247986" PRIVATE="1" TAGS="">Wi-Host: Freeware to Turn Your Windows PC or Laptop into Wi-Fi Hot Spot to Share Internet Connection - AskVG</A>
<DT><A HREF="http://www.choosyosx.com/" ADD_DATE="1409096291" PRIVATE="1" TAGS="">Choosy - A smarter default browser for Mac OS X</A>
<DT><A HREF="http://www.blanket.io/" ADD_DATE="1409097093" PRIVATE="1" TAGS="">blanket.</A>
<DT><A HREF="http://www.bookmarksany.com/" ADD_DATE="1406932975" PRIVATE="1" TAGS="">Bookmarks Anywhere</A>
<DT><A HREF="http://commoncrawl.org/" ADD_DATE="1414727541" PRIVATE="1" TAGS="">Common Crawl</A>
<DT><A HREF="https://github.com/arantius/karma-blocker" ADD_DATE="1407045929" PRIVATE="1" TAGS="">arantius/karma-blocker 路 GitHub</A>
<DT><A HREF="http://www.appgyver.com/composer" ADD_DATE="1407200460" PRIVATE="1" TAGS="">AppGyver</A>
<DT><A HREF="http://grugq.tumblr.com/post/60464139008/alternative-truecrypt-implementations" ADD_DATE="1407208186" PRIVATE="1" TAGS="">Hacker Tradecraft : Alternative TrueCrypt Implementations</A>
<DT><A HREF="http://www.leancrew.com/all-this/2014/08/work-diary-revisited/" ADD_DATE="1409202198" PRIVATE="1" TAGS="">Work diary revisited - All this</A>
<DT><A HREF="https://code.google.com/p/mactype/" ADD_DATE="1409202631" PRIVATE="1" TAGS="">mactype - Ultimate font Rasterizer for Windows - Google Project Hosting</A>
<DT><A HREF="http://pillboxie.com/" ADD_DATE="1409199986" PRIVATE="1" TAGS="">Pillboxie | The easy way to remember your meds | Medication reminder for iPhone and iPod Touch</A>
<DT><A HREF="http://www.leancrew.com/all-this/2014/08/better-work-diary-actions/" ADD_DATE="1409202203" PRIVATE="1" TAGS="">Better work diary actions - All this</A>
<DT><A HREF="http://www.leancrew.com/all-this/2014/07/casting-about/" ADD_DATE="1409202149" PRIVATE="1" TAGS="">Casting about - All this</A>
<DT><A HREF="http://www.ghacks.net/2014/08/05/top-list-free-vpn-services/" ADD_DATE="1407378994" PRIVATE="1" TAGS="">Top List of Free VPN Services - gHacks Tech News</A>
<DT><A HREF="http://skakunmedia.com/docapture/" ADD_DATE="1415399502" PRIVATE="1" TAGS="">doCapture - Free, high-res, screen capturing with size options</A>
<DT><A HREF="https://www.boxcryptor.com/en/boxcryptor-classic-basic-cloud-encryption-try-free" ADD_DATE="1409368279" PRIVATE="1" TAGS="">Boxcryptor Classic | Basic cloud encryption | Try for free | boxcryptor.com</A>
<DT><A HREF="http://techneblog.com/article/automating-your-web-workflow-gruntjs" ADD_DATE="1415052192" PRIVATE="1" TAGS="">Automating Your Web Workflow with Grunt.js | Techneblog</A>
<DT><A HREF="http://www.addictivetips.com/mac-os/glui-os-x-simple-alternative-to-skitch-with-dropbox-support/" ADD_DATE="1402539399" PRIVATE="1" TAGS="">Glui For Mac Is A Simple Alternative To Skitch With Dropbox Support</A>
<DT><A HREF="http://www.bergdesign.com/supercal/" ADD_DATE="1402536206" PRIVATE="1" TAGS="">SuperCal by bergdesign</A>
<DT><A HREF="http://freron.com/" ADD_DATE="1402811617" PRIVATE="1" TAGS="">MailMate</A>
<DT><A HREF="https://www.youtube.com/watch?v=NWz-QuAhaII&amp;feature=youtube_gdata" ADD_DATE="1402737320" PRIVATE="1" TAGS="">Telikin Wow Computer Review - YouTube</A>
<DT><A HREF="https://www.marmosetmusic.com/" ADD_DATE="1402812980" PRIVATE="1" TAGS="">Marmoset // Home</A>
<DT><A HREF="https://sleepingspider.com/" ADD_DATE="1414319548" PRIVATE="1" TAGS="">Sleeping Spider</A>
<DT><A HREF="https://news.ycombinator.com/item?id=8510401" ADD_DATE="1414371083" PRIVATE="1" TAGS="">Ask HN: Is the semantic web still a thing? | Hacker News</A>
<DT><A HREF="http://www.teamdrive.com/" ADD_DATE="1407896623" PRIVATE="1" TAGS="">TeamDrive - Sync your data fast and securely | TeamDrive</A>
<DT><A HREF="https://mailreminder.net/" ADD_DATE="1407896885" PRIVATE="1" TAGS="">Mail Reminders - Always Handy, Never in Your Way</A>
<DT><A HREF="http://inky.com/" ADD_DATE="1403151672" PRIVATE="1" TAGS="">Inky</A>
<DT><A HREF="https://mig5.net/content/awesome-screenshot-and-niki-bot" ADD_DATE="1407918801" PRIVATE="1" TAGS="">Awesome Screenshot URL tracking and niki-bot | mig5.net</A>
<DT><A HREF="http://removephotodata.com/" ADD_DATE="1414373515" PRIVATE="1" TAGS="">Remove personal data from photos before sharing them on the internet</A>
<DT><A HREF="https://soundcloud.com/milk-records-2/pickles-from-the-jar-courtney" ADD_DATE="1407981778" PRIVATE="1" TAGS="">Pickles From The Jar - Courtney Barnett (Milk! Records Compilation) by Milk! Records</A>
<DT><A HREF="http://dailyroutines.typepad.com/daily_routines/" ADD_DATE="1403239104" PRIVATE="1" TAGS="">Daily Routines</A>
<DT><A HREF="http://glimmerblocker.org/" ADD_DATE="1403250865" PRIVATE="1" TAGS="">GlimmerBlocker</A>
<DT><A HREF="https://www.tropo.com/" ADD_DATE="1403328534" PRIVATE="1" TAGS="">Tropo - Cloud API for Voice and SMS</A>
<DT><A HREF="http://www.infoq.com/presentations/click-crash-course-modern-hardware" ADD_DATE="1403316668" PRIVATE="1" TAGS="">A Crash Course in Modern Hardware</A>
<DT><A HREF="http://antennamate.com/" ADD_DATE="1415332471" PRIVATE="1" TAGS="">Antenna Mate – An iPhone, iPad and iPad mini app that take the guess work out of pointing a TV antenna</A>
<DT><A HREF="http://www.getxim.com/" ADD_DATE="1413090356" PRIVATE="1" TAGS="">get xim | share your photos, not your phone</A>
<DT><A HREF="http://www.hostbenchmarker.com/" ADD_DATE="1408333422" PRIVATE="1" TAGS="">Host Benchmarker - Real, unbiased web hosting comparisons</A>
<DT><A HREF="http://www.jackosx.com/" ADD_DATE="1408335245" PRIVATE="1" TAGS="">Jack OS X - a Jack implementation for Mac OS X</A>
<DT><A HREF="http://www.takecontrolbooks.com/resources/0014/software.html" ADD_DATE="1408337037" PRIVATE="1" TAGS="">Backup Software Feature Comparison</A>
<DT><A HREF="http://www.splashbase.co/" ADD_DATE="1408343522" PRIVATE="1" TAGS="">splashbase: find free, public domain, hi res photos</A>
<DT><A HREF="http://www.pexels.com/" ADD_DATE="1408344456" PRIVATE="1" TAGS="">Pexels · Find Free High Quality Photos</A>
<DT><A HREF="http://www.raumrot.com/10/" ADD_DATE="1408343714" PRIVATE="1" TAGS="">raumrot: FREE Hi-Res pictures for your personal and commercial projects. Outstanding Hi-Res Photos for FREE. CC BY / By: Markus Spiske</A>
<DT><A HREF="http://lifehacker.com/whats-the-best-budget-computer-mouse-1596165602" ADD_DATE="1403948847" PRIVATE="1" TAGS="">What&#39;s the Best Budget Computer Mouse?</A>
<DT><A HREF="http://gizmodo.com/streaming-device-showdown-who-wins-the-battle-for-your-1537850412" ADD_DATE="1403999962" PRIVATE="1" TAGS="">Streaming Device Showdown: Who Wins the Battle for Your TV?</A>
<DT><A HREF="https://www.youtube.com/user/GothicSwede" ADD_DATE="1404008413" PRIVATE="1" TAGS="">GothicSwede - YouTube</A>
<DT><A HREF="http://www.deskconnect.com/" ADD_DATE="1413244917" PRIVATE="1" TAGS="">DeskConnect | The missing link between your devices.</A>
<DT><A HREF="https://theyvoteforyou.org.au/" ADD_DATE="1413876624" PRIVATE="1" TAGS="">They Vote For You — How does your MP vote on the issues that matter to you?</A>
<DT><A HREF="http://www.ghacks.net/2014/08/19/convert-ebooks-like-a-pro-with-tebookconverter/" ADD_DATE="1408511643" PRIVATE="1" TAGS="">Convert ebooks like a Pro with TEBookConverter - gHacks Tech News</A>
<DT><A HREF="http://repo.or.cz/w/python-iview.git/tree" ADD_DATE="1408533298" PRIVATE="1" TAGS="">Public Git Hosting - python-iview.git/tree</A>
<DT><A HREF="http://www.amazon.com/Make-It-So-Interaction-Lessons-ebook/dp/B009EGPJCU" ADD_DATE="1408528669" PRIVATE="1" TAGS="">Amazon.com: Make It So: Interaction Design Lessons from Science Fiction eBook: Nathan Shedroff, Christopher Noessel: Kindle Store</A>
<DT><A HREF="http://www.eatnow.com.au/melbourne/edithvale/takeaway.html" ADD_DATE="1404359692" PRIVATE="1" TAGS="">Edithvale Food Delivery and Takeaway VIC. Order Online | eatnow.com.au</A>
<DT><A HREF="http://the-toast.net/2014/08/11/ralph-wiggums-finest-moments/" ADD_DATE="1408575613" PRIVATE="1" TAGS="">Ralph Wiggum&#39;s Finest Moments</A>
<DT><A HREF="http://tracesof.net/uebersicht/" ADD_DATE="1408577790" PRIVATE="1" TAGS="">Übersicht</A>
<DT><A HREF="http://resolutiontab.com/" ADD_DATE="1408616848" PRIVATE="1" TAGS="">ResolutionTab — Fast switching between Standard and HiDPI display modes.</A>
<DT><A HREF="http://gifbrewery.com/" ADD_DATE="1413954262" PRIVATE="1" TAGS="">GIF Brewery</A>
<DT><A HREF="http://www.archeeve.com/" ADD_DATE="1413961470" PRIVATE="1" TAGS="">Archeeve</A>
<DT><A HREF="https://www.npmjs.com/package/budo-chrome" ADD_DATE="1424569604" PRIVATE="1" TAGS="">budo-chrome</A>
<DT><A HREF="https://archive.today/" ADD_DATE="1413535291" PRIVATE="1" TAGS="">archive.today - webpage capture</A>
<DT><A HREF="http://www.cockos.com/licecap/" ADD_DATE="1413617301" PRIVATE="1" TAGS="">Cockos Incorporated | LICEcap</A>
<DT><A HREF="https://github.com/adambutler/kevlar" ADD_DATE="1413623692" PRIVATE="1" TAGS="">adambutler/kevlar 路 GitHub</A>
<DT><A HREF="http://www.imdb.com/title/tt2548738/" ADD_DATE="1414579048" PRIVATE="1" TAGS="">Rich Hill (2014) - IMDb</A>
<DT><A HREF="http://www.ghacks.net/2014/08/22/pangobright-is-a-screen-dimming-tool-with-multi-monitor-support/" ADD_DATE="1408772837" PRIVATE="1" TAGS="">Pangobright is a screen dimming tool with multi-monitor support - gHacks Tech News</A>
<DT><A HREF="http://brewformulas.org/" ADD_DATE="1408788361" PRIVATE="1" TAGS="">Homebrew Formulas</A>
<DT><A HREF="https://itunes.apple.com/us/app/unbound/id690375005?mt=12" ADD_DATE="1408836315" PRIVATE="1" TAGS="">Mac App Store - Unbound</A>
<DT><A HREF="http://demosthenes.info/blog/723/Seven-Ways-of-Centering-With-CSS" ADD_DATE="1415228201" PRIVATE="1" TAGS="">demosthenes.info – Seven Ways of Centering With CSS</A>
<DT><A HREF="http://hnapp.com/" ADD_DATE="1415242857" PRIVATE="1" TAGS="">hnapp – Search Hacker News, subscribe via RSS or JSON</A>
<DT><A HREF="https://dbinbox.com/" ADD_DATE="1415244516" PRIVATE="1" TAGS="">DBinbox - receive files that are too big for email.</A>
<DT><A HREF="https://www.protectstar.com/en/products/ishredder-ios" ADD_DATE="1405666165" PRIVATE="1" TAGS="">iShredder. Erase iPhone, iPad, iPod touch</A>
<DT><A HREF="https://www.readytosms.com.au/" ADD_DATE="1405672049" PRIVATE="1" TAGS="">Global SMS gateway. Instant mass SMS solutions, no setup fees. Easy integration through API. Bulk SMS solutions.</A>
<DT><A HREF="http://i-funbox.com/" ADD_DATE="1405731205" PRIVATE="1" TAGS="">iFunBox for Windows | File Manager, Browser, Explorer, Transferer for iPhone, iPad and iPod Touch</A>
<DT><A HREF="http://www.irradiated.net/?page=sleepytime" ADD_DATE="1405749309" PRIVATE="1" TAGS="">Irradiated.net - Sleepytime</A>
<DT><A HREF="http://www.reddit.com/r/SideProject/comments/2agaso/cronitor_simple_cron_monitoring/" ADD_DATE="1405746992" PRIVATE="1" TAGS="">Cronitor - Simple Cron Monitoring : SideProject</A>
<DT><A HREF="http://www.montagebook.com/" ADD_DATE="1406007570" PRIVATE="1" TAGS="">Montage - Effortless Photo Books, Made with Love.</A>
<DT><A HREF="http://thedissolve.com/" ADD_DATE="1406116355" PRIVATE="1" TAGS="">The Dissolve</A>
<DT><A HREF="http://www.findmespot.com/en/index.php?cid=100" ADD_DATE="1406163349" PRIVATE="1" TAGS="">SPOT Gen3</A>
<DT><A HREF="http://www.theinstructional.com/guides/disk-management-from-the-command-line-part-2" ADD_DATE="1406173386" PRIVATE="1" TAGS="">Disk Management From the Command-Line, Part 2 - The Instructional</A>
<DT><A HREF="http://bikesizechart.com/" ADD_DATE="1413705367" PRIVATE="1" TAGS="">Bike Size Chart - City, Road, Mountain, BMX and Kids Bikes</A>
<DT><A HREF="https://www.raymond.cc/blog/how-to-create-full-windows-backup-by-imaging-without-using-norton-ghost/?utm_source=feedburner&amp;utm_medium=feed&amp;utm_campaign=Feed%3A+RaymondccBlog+%28Raymond.CC+Blog%29" ADD_DATE="1406274296" PRIVATE="1" TAGS="">3 Free Norton Ghost Alternatives to Create a Full Windows Image Backup • Raymond.CC</A>
<DT><A HREF="http://www.addictivetips.com/mac-os/airmail-os-x-gmail-client-with-dropbox-support-easy-filtering-review/" ADD_DATE="1406348511" PRIVATE="1" TAGS="">Airmail: OS X Mail Client With Dropbox Support &amp; Easy Filtering [Review]</A>
<DT><A HREF="http://www.addictivetips.com/mac-os/browse-manage-icloud-files-from-your-mac-with-plain-cloud/" ADD_DATE="1406348203" PRIVATE="1" TAGS="">Browse &amp; Manage iCloud Files From Your Mac With Plain Cloud</A>
<DT><A HREF="http://sourceforge.net/projects/legacyoslinux/?source=blog" ADD_DATE="1406433681" PRIVATE="1" TAGS="">Legacy OS | Free software downloads at SourceForge.net</A>
<DT><A HREF="http://www.filebot.net/" ADD_DATE="1406435648" PRIVATE="1" TAGS="">FileBot - The ultimate TV and Movie Renamer / Subtitle Downloader</A>
</DL><p>
