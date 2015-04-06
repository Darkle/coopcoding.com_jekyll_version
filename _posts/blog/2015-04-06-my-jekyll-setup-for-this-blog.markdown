---
title: My Jekyll Setup For This Blog
date: 2015-04-06 12:46:26
tags: [Jekyll, Alfred]
---

So I wanted to set up a coding blog I decided on using [Jekyll](http://jekyllrb.com/) because it’s relatively easy to set up and there’s tons of good info & tutorials on the web. I briefly played around with [Hugo](http://gohugo.io/), and although the documentation on the site is really good, I didn’t find much in the way of tutorial and articles from 3rd-party sites, so I stuck with Jekyll.

### Blog Structure

For the site structure, I wanted it to be `coopcoding.com/projects/projectname/` and `coopcoding.com/blog/blog post title/`. This turned out to be a bit more difficult than I first envisioned. The `coopcoding.com/blog/blog post title/` was fairly easy to set up, but `coopcoding.com/projects/projectname/` took a bit of work.

At first I thought I would use the [default](http://jekyllrb.com/docs/pages/) way of creating pages and just stick them in the `coopcoding.com/projects/` folder, but unfortunately there is currently (jekyll 2.5.3) no way to iterate through all the pages in a directory.

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
![Jekyll Folder Structure](/assets/images/blogpostimages/jek-folder-ss.png)
and a screenshot of Jekyll's output folder structure:
![Jekyll Output Folder Structure](/assets/images/blogpostimages/jek-build-folder-structure.png)

Here is the html for the index.html in the `/projects/` folder:

``` markup
---
layout: default
cssBodyClass: projects-page
title: Coop.Coding Projects
---

<section class="projects">

  {% for project in site.categories.projects %}
  <a href="{{ project.url }}" class="project-listing">
      <div class="img-wrapper">
        <img class="project-screenshot-img" src="{{ site.url }}/assets/images/projectbranding/{{ project.title | downcase | replace:' ','_' }}.jpg" alt="{{ post.title }} branding image">
      </div>
      <svg class="project-screenshot-svg">
          <image xlink:href="{{ site.url }}/assets/images/projectbranding/{{ project.title | downcase | replace:' ','_' }}.jpg" x="0" y="-62" width="100%" height="174"/>
      </svg>

      <div class="project-details">

        <h2 class="project-title">{{ project.title }}</h2>

        <p class="project-description">{{ project.summary }}</p>

      </div>

  </a>
  {% endfor %}

</section>
```
You can see I'm looping over the `site.categories.projects` and listing each post in the "projects" category. 

It's pretty much the same for the html in the index.html in the `/blog/` folder:

``` markup
---
layout: default
cssBodyClass: blog-posts
title: Coop.Coding Blog
---

<section class="recent-blog-posts">

  <div class="section-headings">
    <a href="{{ site.url }}/blog/">
      <h1>Blog Posts</h1>
    </a>
  </div>

  {% for post in site.categories.blog %}
  <article>
    <header>
      <h2>
        <a class="post-link-header" href="{{ post.url }}">{{ post.title }}</a>
      </h2>
      <span class="post-date">{{ post.date | date: "%b %-d, %Y" }}</span>
    </header>

    <section class="blog-post-section">
      {{ post.content | truncatewords:75 }}

      <div class="gradient-hide"></div>

    </section>

    <section class="blog-post-section">
      <a class="full-article-link" href="{{ post.url }}">Read Full Article</a>
    </section>

    <footer>
      <ul class="tags">
      {% for tag in post.tags %}
        <li class="tag-item">
          <a href="{{ site.url }}/tag/{{ tag }}">{{ tag }}</a>
          <!-- <span class="tag-description">Find articles tagged &quot;foo1&quot;</span> -->
        </li>
      {% endfor %}
      </ul>
    </footer>
  </article>
  {% endfor %}

</section>
```
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
This tells Jekyll that for posts in that end up in the path `coopcoding.com/blog/` and are of the type "posts" that they are all in the category of "blog" and should use the layout "post". The layout of "post" corresponds to the `post.html` in the `_layouts directory`. It then tells Jekyll that for posts in that end up in the path `coopcoding.com/projects/` and are of the type "posts" that they are all in the category of "projects" and should use the layout "project". The layout of "post" corresponds to the `project.html` in the `_layouts directory`. You can check out the html for those files here: https://github.com/Darkle/coopcoding.com_jekyll_version/tree/master/_layouts

 (you can also see my complete `_config.yml` here: https://github.com/Darkle/coopcoding.com_jekyll_version/blob/master/_config.yml)

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

For the actual syntax highlighting, I couldn't seem to get rouge to generate line numbers, so I used [prism.js](http://prismjs.com/). The prism.js output It looks great and I figure so long as the javascript is at the bottom of the page and not blocking anything loading it should be fine and wont annoy people viewing the page. On the [prism.js download page](http://prismjs.com/download.html) you can pick and choose what languages to support, which is pretty neat. 

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

### Plugins & Building Locally

Because Github pages only supports a [few plugins](https://help.github.com/articles/using-jekyll-plugins-with-github-pages/) and I wanted to use [this](http://charliepark.org/tags-in-jekyll/) tag plugin, I had to set it up so that Jekyll built the site locally, then I pushed that built version to my [darkle.github.io repository](https://github.com/Darkle/darkle.github.io). Doing this manually is a bit of a pain, but I stumbled on to [this neat article](http://spinhalf.net/2015/01/04/getting-started-with-a-jekyll-blog/) about using an [Alfred](http://www.alfredapp.com/) workflow to make things faster and easier. 

Basically it allows you to create a new Jekyll post (including front-matter) with a shortcut in Alfred. 

My Alfred workflow shortcuts look like this: 

![Jekyll Alfred Screenshot](/assets/images/blogpostimages/Jek-Alfred-ss.png)

When I select a new blog post it runs the following bash commands:

``` bash
# Adjust these variables to your installation:

sitedir=/Users/username/Coding/Projects/coopcoding.com/jekyll_files/
editor="Whiskey.app"
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
What this does is takes the title I gave it in Alfred and prepends the current date to that, then it creates a new file in the `_posts/blog/` directory and that title and date as the file name (Jekyll needs a `YEAR-MONTH-DAY-title.MARKUP` format for post file names), then add the default front-matter for blog posts, plus the blog title that was specified by me in Alfred. It then opens that file in Whiskey.app.

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

cd $JEKYLL_BLOG_DIRECTORY
git add .
git commit -a -m "Post $3-$2"
git push origin master

terminal-notifier -title "Git Push for CoopCoding Jekyll Files Done" -message "" -open "https://github.com/Darkle/coopcoding.com_jekyll_version"

jekyll build

terminal-notifier -title "Jekyll Built Static Files" -message ""

STATIC_BLOG_DIRECTORY="/Users/username/Coding/Projects/coopcoding.com/darkle.github.io/"

cd $STATIC_BLOG_DIRECTORY
git add .
git commit -a -m "Post $3-$2"
git push origin master

terminal-notifier -title "Git Push for CoopCoding Static Files Done" -message "" -open "https://github.com/Darkle/darkle.github.io"
```
Originally I was going to use the default notifier for OSX in the bash script but it wasn't working for me, so I used this library insted: [https://github.com/alloy/terminal-notifier](https://github.com/alloy/terminal-notifier).

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

What this does is iterate through all of the files in the `_posts/blog` directory and then list them in Alfred. When you select which file you want, Alfred then opens that file in Whiskey.app. 

You can grab my Alfred workflow [here](https://drive.google.com/file/d/0B2rOnFGX-QzGTHpQbksyRUExd1k/view?usp=sharing).

### Editing The Markdown

Originally I was using [this Markdown app called Whiskey](http://www.alfredapp.com/), but it's still in beta and I had a few issues with it crashing when posting complex code blocks. I had a search around for a replacement Markdown editor and stumbled upon [https://stackedit.io](https://stackedit.io).

Stack Edit is able to open, edit and save/sync with dropbox, so since my site repository is already in my dropbox folder, I can just use Stack Edit to edit markdown files.  It's pretty awesome, here's a screenshot of me typing this post: 
<a href="/assets/images/blogpostimages/StackEdit-editor-ss.png"><img src="/assets/images/blogpostimages/StackEdit-editor-ss.png" alt="Stack Edit Screen Shot" title=""></a>.(notice the auto code highlighting in the preview 👀)

So I changed the bash script for both the new blog post and new project post so that instead of opening the Whiskey markdown editor, it opens https://stackedit.io in the default browser.

```bash
tags:[]
---

EOT
#open -a "$editor" $filename
open https://stackedit.io/editor
```

One of the neat things about Stack Edit is that if you open a second tab in your browser with Stack Edit open in it, it will detect a second tab open and close the other tab. 👍



