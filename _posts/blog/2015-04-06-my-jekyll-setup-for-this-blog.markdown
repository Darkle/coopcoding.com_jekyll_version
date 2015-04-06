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

``` html
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

``` html
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

```
{% highlight ruby %}
def foo
  puts 'foo'
end
{% endhighlight %}
```
Luckily, the Kramdown [markdown interpreter in Jekyll supports](http://jekyllrb.com/docs/configuration/#kramdown) Github Flavoured Markdown, specifically the [code blocks](https://help.github.com/articles/github-flavored-markdown/#syntax-highlighting). With this enabled, a code block like this:

	``` ruby
	def print_hi(name)
	  puts "Hi, #{name}"
	end
	print_hi('Tom')
	#=> prints 'Hi, Tom' to STDOUT.
	```

will be render into this HTML:

```
<pre><code class="language-ruby">
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=&gt; prints 'Hi, Tom' to STDOUT.
</code></pre>
```

Which is great!

Unfortunately, I couldn't get 
I has some trouble getting the Jekyll built in syntax highlighters to work properly with line numbering, so I ended up using [prism.js](http://prismjs.com/). It looks great and I figure so long as the javascript is at the bottom of the page and not blocking anything loading it should be fine and wont annoy people viewing the page. On the [prism.js download page](http://prismjs.com/download.html) you can pick and choose what languages to support, which is pretty neat. 

I wanted