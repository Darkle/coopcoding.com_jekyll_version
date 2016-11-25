---
title: My Jekyll Setup For This Blog
date: 2015-04-06 12:46:26
tags: [Jekyll, Alfred]
---

So I wanted to set up a coding blog I decided on using [Jekyll](http://jekyllrb.com/) because it’s relatively easy to set up and there’s tons of good info & tutorials on the web. I briefly played around with [Hugo](http://gohugo.io/), and although the documentation on the site is really good, I didn’t find much in the way of tutorials and articles from 3rd-party sites, so I stuck with Jekyll.

### Blog Structure

For the site structure, I wanted it to be `coopcoding.space/projects/projectname/` and `coopcoding.space/blog/blog post title/`. This turned out to be a bit more difficult than I first envisioned. The `coopcoding.space/blog/blog post title/` was fairly easy to set up, but `coopcoding.space/projects/projectname/` took a bit of work.

At first I thought I would use the [default](http://jekyllrb.com/docs/pages/) way of creating pages and just stick them in the `coopcoding.space/projects/` folder, but unfortunately there is currently (<small><small>jekyll 2.5.3</small></small>) no way to iterate through all the pages in a directory. You can use collections or add data to the data directory, but these won't really work with the default pagination.

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

Then, in my _config.yml for the site I put the following:

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

The `permalink: /:categories/:title` tells jekyll to spit out all the posts in the `_posts` folder and take what category they are (in this case either a blog or project) and create subfolders in the output directory of `coopcoding.space/projects/` & `coopcoding.space/blog/` and generate all the blog posts in those subdirectories for each category.

Then I created an index.html page inside of the `/projects/` folder and inside of the `/blog/` folder. These were so that when a user visited `coopcoding.space/projects/`, they would be shown a list of the latest project pages, and when they visited `coopcoding.space/blog/`, they would be shown a list of the latest blog posts.

Here are screenshots of my Jekyll folder structure to better explain it:

![Jekyll Folder Structure](http://coopcoding.space/assets/images/blogpostimages/jek-folder-ss.png)

and a screenshot of Jekyll's output folder structure:

![Jekyll Output Folder Structure](http://coopcoding.space/assets/images/blogpostimages/jek-build-folder-structure.png)

Here is the html for the index.html in the `/projects/` folder: [https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/project.html](https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/project.html)

You can see I'm looping over the `site.categories.projects` and listing each post in the "projects" category.

It's pretty much the same for the html in the index.html in the `/blog/` folder: [https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/project.html](https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/project.html)

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

This tells Jekyll that for posts in that end up in the path `coopcoding.space/blog/` and are of the type "posts" that they are all in the category of "blog" and should use the layout "post". The layout of "post" corresponds to the [post.html](https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/post.html) in the `_layouts directory`. It then tells Jekyll that for posts in that end up in the path `coopcoding.space/projects/` and are of the type "posts" that they are all in the category of "projects" and should use the layout "project". The layout of "post" corresponds to the [project.html](https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_layouts/project.html) in the `_layouts directory`.

You can also see my complete `_config.yml` here: [https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_config.yml](https://github.com/Darkle/coopcoding.space_jekyll_version/blob/master/_config.yml)

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

But that seemed like a bit of a hassle. What I really wanted was for the line numbers to show up if the code was more than one line. Unfortunately there is no automatic way to do this with prism, so I went ahead and altered the way the line numbers plugin worked.

Here is the original prism.js plugin code

``` javascript
Prism.hooks.add('after-highlight', function (env) {
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)
	var pre = env.element.parentNode;
	if (!pre || !/pre/i.test(pre.nodeName) || pre.className.indexOf('line-numbers') === -1) {
		return;
	}

	var linesNum = (1 + env.code.split('\n').length);
	var lineNumbersWrapper;

	var lines = new Array(linesNum);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});
```

and my changes

``` javascript
Prism.hooks.add('after-highlight', function (env) {
	// works only for <code> wrapped inside <pre data-line-numbers> (not inline)
	var pre = env.element.parentNode;
	var multiLineCheck = env.code.match(/\n(?!$)/g);

	//ignore if not a pre element or if only one line
	if (!pre || !/pre/i.test(pre.nodeName) || !multiLineCheck) {
		return;
	}

	//for the highlighting CSS
	if(pre.className.indexOf('line-numbers') === -1) {
		pre.className += ' line-numbers';
	}

	var linesNum = multiLineCheck.length + 1;
	var lineNumbersWrapper;

	var lines = new Array(linesNum + 1);
	lines = lines.join('<span></span>');

	lineNumbersWrapper = document.createElement('span');
	lineNumbersWrapper.className = 'line-numbers-rows';
	lineNumbersWrapper.innerHTML = lines;

	if (pre.hasAttribute('data-start')) {
		pre.style.counterReset = 'linenumber ' + (parseInt(pre.getAttribute('data-start'), 10) - 1);
	}

	env.element.appendChild(lineNumbersWrapper);

});
```

You can see it now only checks to see if it is a pre element and if it has more than one line. Then if it doesn’t have a class name of “line-numbers” it adds it in order for the CSS rules for the line numbering to be applied. (note: my code uses some code from [this pull request](https://github.com/PrismJS/prism/pull/385/commits) to fix extra lines being added)

### Plugins, Building Locally & Alfred

Because Github pages only supports a [few plugins](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/) and I wanted to use [this](http://charliepark.org/tags-in-jekyll/) tag plugin, I had to set it up so that Jekyll built the site locally, then I pushed that built version to my [darkle.github.io repository](https://github.com/Darkle/darkle.github.io). Doing this manually is a bit of a pain, but I stumbled on to [this neat article](http://spinhalf.net/2015/01/04/getting-started-with-a-jekyll-blog/) about using an [Alfred](http://www.alfredapp.com/) workflow to make things faster and easier.

Basically it allows you to create a new Jekyll post (including front-matter) with an shortcut in Alfred.

My Alfred workflow shortcuts look like this:

![Jekyll Alfred Screenshot](http://coopcoding.space/assets/images/blogpostimages/Jek-Alfred-ss3.png)

When I select a new blog post it runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/site_jekyll_files/
editor="Typora.app"
extension=md

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

What this does is takes the title I gave it in Alfred and prepends the current date to that, then it creates a new file in the `_posts/blog/` directory and uses that title and date as the file name (Jekyll needs a `YEAR-MONTH-DAY-title.MARKUP` format for post file names). Then it adds the default front-matter for blog posts, plus the blog title that was specified by me in Alfred. It then opens that file in my markdown editor [Typora.app](http://typora.io/).

When I select a new project post it runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/site_jekyll_files/
editor="Typora.app"
extension=md

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

JEKYLL_BLOG_DIRECTORY="/Users/username/Coding/Projects/coopcoding.space/jekyll_files/"

DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S')

cd $JEKYLL_BLOG_DIRECTORY
git add .
git commit -a -m "Post $DATE_TIME"
#check if there were any new files made on github
git pull --rebase
#push to github
git push origin master

terminal-notifier -title "Git Push for CoopCoding Jekyll Files Done" -message "" -open "https://github.com/Darkle/coopcoding.space_jekyll_version"

jekyll build

terminal-notifier -title "Jekyll Built Static Files" -message ""

STATIC_BLOG_DIRECTORY="/Users/username/Coding/Projects/coopcoding.space/darkle.github.io/"

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

sitedir=/Users/username/Coding/Projects/coopcoding.space/jekyll_files/
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

The “Serve Jekyll Blog” opens a terminal, cd’s to the jekyll blog files then serves from that directory

![Alfred Screenshot](http://coopcoding.space/assets/images/blogpostimages/AlfredPreferences.png)

Then it opens the blog in the default browser by running the following bash commands

``` bash
#wait for the jekyll server to start up
sleep 3
open http://127.0.0.1:4000/
```

You can grab my Alfred workflow [here](https://drive.google.com/uc?export=download&id=0B2rOnFGX-QzGajEySER5TWd5OEU).

### Editing The Markdown

I tried a number of Markdown editors, but settled on [Typora](http://typora.io/). It has a number of neat features such as supporting [github style code fences](https://help.github.com/articles/github-flavored-markdown/#fenced-code-blocks)(and highlighting them), YAML front matter recognition and showing images while editing the post. Here’s a screenshot of me editing this post in Typora:

![Typora Screenshot](http://coopcoding.space/assets/images/blogpostimages/TyporaSS.png)

You can see that the code block is highlighted and the image is displayed while editing. Check out all the features it has here: [http://typora.io/#feature](http://typora.io/#feature).

### Automatic Images In Typora

In order to get the images that I’m working with for blog posts to show up while I’m editing them, they needed to be hosted online. I thought about just using an image hoster like imgur, but I really wanted to keep control of the hosting.

I could always build and push the blog every time I added a new image to the blog post I was editing, but that seemed really inefficient. What I settled on was using OSX’s folder action feature to copy the file from the image assets folder in my jekyll folder to the static output folder and then pushing that to github so that the image is now being served by github and Typora can display it in the editor.

``` applescript
--from http://foolsworkshop.com/applescript/2008/05/an-applescript-replace-text-method/
on replaceText(find, replace, subject)
  set prevTIDs to text item delimiters of AppleScript
  set text item delimiters of AppleScript to find
  set subject to text items of subject

  set text item delimiters of AppleScript to replace
  set subject to "" & subject
  set text item delimiters of AppleScript to prevTIDs

  return subject
end replaceText

on adding folder items to this_folder after receiving added_items
  try
    tell application "Finder"
      --get the name of the folder
      set the folder_name to the name of this_folder
    end tell

    set textToReplace to "file:///Users/coop/Dropbox/Coding/Projects/coopcoding.space/coopcoding.space_jekyll_version"
    set folderToCopyTo to "Macintosh HD:Users:coop:Dropbox:Coding:Projects:coopcoding.space:darkle.github.io:assets:images:blogpostimages"
    set convertedTextForClipboard to ""

    repeat with aFile in added_items

      tell application "Finder"
        try
          set fileProps to (get properties of aFile)
          set fileURL to (get URL of fileProps) as string
        on error errMsg
          display dialog "ERROR: " & errMsg
        end try

      end tell

      --the last & is for a new line in case there is more than one image
      set convertedTextForClipboard to convertedTextForClipboard & (get replaceText(textToReplace, "http://coopcoding.space", fileURL)) & "
"
      set filePosixURL to get replaceText("file://", "", fileURL)

      tell application "Finder"
        copy aFile to folder folderToCopyTo
      end tell

    end repeat

    set the clipboard to convertedTextForClipboard

    do shell script "DATE_TIME=$(date +'%Y-%m-%d %H:%M:%S') && cd '/Users/coop/Dropbox/Coding/Projects/coopcoding.space/darkle.github.io/' && git add . && git commit -a -m 'Post $DATE_TIME' && git push origin master && export PATH=/usr/local/bin:$PATH && terminal-notifier -title 'Git Push for CoopCoding Static Images Done' -message '' -open 'https://github.com/Darkle/darkle.github.io'"

  on error errMsg
    display dialog "ERROR: " & errMsg
  end try

end adding folder items to
```

### Image Optimization

In order to optimize the images before serving them, I used the great [ImageOptim](https://imageoptim.com/) app and a folder action to trigger it.

``` applescript
on adding folder items to this_folder after receiving added_items
  --delay so dont interfere with the other folder action that copies the image
  delay 3
  try
    tell application "Finder"
      --get the name of the folder
      set the folder_name to the name of this_folder
    end tell

    set the item_count to the number of items in the added_items

    repeat with aFile in added_items

      tell application "Finder"
        try
          set fileProps to (get properties of aFile)
          set fName to (get name of fileProps)

        on error errMsg
          display dialog "ERROR: " & errMsg
        end try

      end tell

      tell application "ImageOptim" to open aFile

    end repeat

    delay 2

    tell application "ImageOptim" to activate

  on error errMsg
    display dialog "ERROR: " & errMsg
  end try
end adding folder items to
```

Now every time I add a new photo to the `/assets/images/blogpostimages` folder, it runs the applescript above and opens the image(s) in ImageOptim and optimises the image(s).

















