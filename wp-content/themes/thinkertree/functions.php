<?php
/**
 * thinkertree functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package thinkertree
 */

// Clean up wordpres <head>
remove_action("wp_head", "rsd_link"); // remove really simple discovery link
remove_action("wp_head", "wp_generator"); // remove wordpress version
remove_action("wp_head", "feed_links", 2); // remove rss feed links (make sure you add them in yourself if youre using feedblitz or an rss service)
remove_action("wp_head", "feed_links_extra", 3); // removes all extra rss feed links
remove_action("wp_head", "index_rel_link"); // remove link to index page
remove_action("wp_head", "wlwmanifest_link"); // remove wlwmanifest.xml (needed to support windows live writer)
remove_action("wp_head", "start_post_rel_link", 10, 0); // remove random post link
remove_action("wp_head", "parent_post_rel_link", 10, 0); // remove parent post link
remove_action("wp_head", "adjacent_posts_rel_link", 10, 0); // remove the next and previous post links
remove_action("wp_head", "adjacent_posts_rel_link_wp_head", 10, 0);
remove_action("wp_head", "wp_shortlink_wp_head", 10, 0);

if (!function_exists("thinkertree_setup")):
  /**
   * Sets up theme defaults and registers support for various WordPress features.
   *
   * Note that this function is hooked into the after_setup_theme hook, which
   * runs before the init hook. The init hook is too late for some features, such
   * as indicating support for post thumbnails.
   */
  function thinkertree_setup()
  {
    /*
     * Make theme available for translation.
     * Translations can be filed in the /languages/ directory.
     * If you're building a theme based on thinkertree, use a find and replace
     * to change 'thinkertree' to the name of your theme in all the template files.
     */
    load_theme_textdomain(
      "thinkertree",
      get_template_directory() . "/languages"
    );

    // Add default posts and comments RSS feed links to head.
    add_theme_support("automatic-feed-links");

    /*
     * Let WordPress manage the document title.
     * By adding theme support, we declare that this theme does not use a
     * hard-coded <title> tag in the document head, and expect WordPress to
     * provide it for us.
     */
    add_theme_support("title-tag");

    /*
     * Enable support for Post Thumbnails on posts and pages.
     *
     * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
     */
    add_theme_support("post-thumbnails");

    // This theme uses wp_nav_menu() in one location.
    register_nav_menus([
      "menu-1" => esc_html__("Primary", "thinkertree"),
      "footer-menu" => esc_html__("Footer", "thinkertree"),
    ]);

    /*
     * Switch default core markup for search form, comment form, and comments
     * to output valid HTML5.
     */
    add_theme_support("html5", [
      "search-form",
      "comment-form",
      "comment-list",
      "gallery",
      "caption",
    ]);

    // Set up the WordPress core custom background feature.
    add_theme_support(
      "custom-background",
      apply_filters("thinkertree_custom_background_args", [
        "default-color" => "ffffff",
        "default-image" => "",
      ])
    );

    // Add theme support for selective refresh for widgets.
    add_theme_support("customize-selective-refresh-widgets");

    /**
     * Add support for core custom logo.
     *
     * @link https://codex.wordpress.org/Theme_Logo
     */
    add_theme_support("custom-logo", [
      "height" => 250,
      "width" => 250,
      "flex-width" => true,
      "flex-height" => true,
    ]);
  }
endif;
add_action("after_setup_theme", "thinkertree_setup");

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function thinkertree_content_width()
{
  // This variable is intended to be overruled from themes.
  // Open WPCS issue: {@link https://github.com/WordPress-Coding-Standards/WordPress-Coding-Standards/issues/1043}.
  // phpcs:ignore WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound
  $GLOBALS["content_width"] = apply_filters("thinkertree_content_width", 640);
}
add_action("after_setup_theme", "thinkertree_content_width", 0);

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function thinkertree_widgets_init()
{
  register_sidebar([
    "name" => esc_html__("Sidebar", "thinkertree"),
    "id" => "sidebar-1",
    "description" => esc_html__("Add widgets here.", "thinkertree"),
    "before_widget" => '<section id="%1$s" class="widget %2$s">',
    "after_widget" => "</section>",
    "before_title" => '<h2 class="widget-title">',
    "after_title" => "</h2>",
  ]);
}
add_action("widgets_init", "thinkertree_widgets_init");

/**
 * Enqueue scripts and styles.
 */

/* First, create a function to retrieve the hashed version of the assets' file name */
function get_versioning_asset_path($asset)
{
  $map = get_template_directory() . "/dist/assets-manifest.json";
  static $hash = null;

  if (null === $hash) {
    $hash = file_exists($map) ? json_decode(file_get_contents($map), true) : [];
  }

  if (array_key_exists($asset, $hash)) {
    return "/dist/" . $hash[$asset];
  }

  return $asset;
}

/* Enqueue sthe scripts and styles */
function thinkertree_scripts()
{
  wp_enqueue_style(
    "site_main_css",
    get_template_directory_uri() . get_versioning_asset_path("main.css")
  );

  wp_enqueue_script(
    "site_main_js",
    get_template_directory_uri() . get_versioning_asset_path("main.js"),
    [],
    null,
    true
  );

  if (is_singular() && comments_open() && get_option("thread_comments")) {
    wp_enqueue_script("comment-reply");
  }
}
add_action("wp_enqueue_scripts", "thinkertree_scripts");

/**
 * ACF Blocks
 */
// Check if function exists and hook into setup.
if (function_exists("acf_register_block_type")) {
  add_action("acf/init", "register_acf_block_types");
}

function register_acf_block_types()
{
  // Register ACF block
  acf_register_block_type([
    // Add args here
  ]);
}

/**
 * Add Options Page in ACF Pro
 */
if (function_exists("acf_add_options_page")) {
  $page = acf_add_options_page([
    "page_title" => __("Global Theme Settings", "thinkertree"),
    "menu_title" => __("Global Theme Settings", "thinkertree"),
    "menu_slug" => "global-theme-settings",
    "capability" => "edit_posts",
    "redirect" => false,
  ]);
}

/**
 * Thumbnail Upscale
 */
function thinkertree_thumbnail_upscale(
  $default,
  $orig_w,
  $orig_h,
  $new_w,
  $new_h,
  $crop
) {
  if (!$crop) {
    return null;
  } // let the wordpress default function handle this

  $aspect_ratio = $orig_w / $orig_h;
  $size_ratio = max($new_w / $orig_w, $new_h / $orig_h);

  $crop_w = round($new_w / $size_ratio);
  $crop_h = round($new_h / $size_ratio);

  $s_x = floor(($orig_w - $crop_w) / 2);
  $s_y = floor(($orig_h - $crop_h) / 2);

  return [
    0,
    0,
    (int) $s_x,
    (int) $s_y,
    (int) $new_w,
    (int) $new_h,
    (int) $crop_w,
    (int) $crop_h,
  ];
}
add_filter("image_resize_dimensions", "thinkertree_thumbnail_upscale", 10, 6);

/**
 * Custom Image Sizes
 */
function thinkertree_custom_image_sizes()
{
  // add_image_size('medium-large', 800, 800);
  // add_image_size('hero-image', 1920, 9999);
}
add_action("after_setup_theme", "thinkertree_custom_image_sizes");

/**
 * Page Slug Body Class
 */
function add_slug_body_class($classes)
{
  global $post;
  if (is_home()) {
    $key = array_search("blog", $classes);
    if ($key > -1) {
      unset($classes[$key]);
    }
  } elseif (is_page()) {
    $classes[] = sanitize_html_class($post->post_name);
  } elseif (is_singular()) {
    $classes[] = sanitize_html_class($post->post_name);
  }
  return $classes;
}
add_filter("body_class", "add_slug_body_class");

/**
 * Set excerpt length
 */
// function custom_excerpt_length( $length ) {
// 	return 30;
// }
// add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

/**
 * Read More Excerpt link
 */
// function new_excerpt_more($more) {
// 	global $post;
// 	return '… <a href="'. get_permalink($post->ID) . '" class="read-more-link">' . 'Read More &raquo;' . '</a>';
// }
// add_filter('excerpt_more', 'new_excerpt_more');

/**
 * Implement the Custom Header feature.
 */
require get_template_directory() . "/inc/custom-header.php";

/**
 * Custom template tags for this theme.
 */
require get_template_directory() . "/inc/template-tags.php";

/**
 * Functions which enhance the theme by hooking into WordPress.
 */
require get_template_directory() . "/inc/template-functions.php";

/**
 * Customizer additions.
 */
require get_template_directory() . "/inc/customizer.php";

/**
 * Load Jetpack compatibility file.
 */
if (defined("JETPACK__VERSION")) {
  require get_template_directory() . "/inc/jetpack.php";
}
