-- =================================================================
-- Add New Theme Blocks for Advanced Page Builder
-- This script adds layout blocks and advanced component blocks
-- to the existing themes (especially Basic theme - id=1)
-- =================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =================================================================
-- Layout Blocks (add to all themes)
-- =================================================================

-- SECTION BLOCK
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
),
(2, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","backgroundImage":"","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
),
(3, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
),
(4, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
),
(5, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
);

-- CONTAINER BLOCK
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
),
(2, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
),
(3, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
),
(4, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
),
(5, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1200","alignment":"center","padding":{"top":20,"right":20,"bottom":20,"left":20},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
);

-- COLUMNS BLOCK
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"medium","columnWidths":["50","50"],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional','items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 13
),
(2, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":3,"gap":"medium","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 13
),
(3, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"small","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 13
),
(4, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 13
),
(5, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"large","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 13
);

-- GRID BLOCK
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":3,"gap":"medium","autoFit":true,"minColumnWidth":250}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 14
),
(2, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":4,"gap":"small","autoFit":true,"minColumnWidth":200}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 14
),
(3, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":4,"gap":"small","autoFit":true,"minColumnWidth":250}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 14
),
(4, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":3,"gap":"medium","autoFit":false,"minColumnWidth":300}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 14
),
(5, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":3,"gap":"large","autoFit":true,"minColumnWidth":250}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 14
);

-- =================================================================
-- Advanced Component Blocks
-- =================================================================

-- TESTIMONIALS BLOCK
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle',
 '{"title":"What Our Customers Say","testimonials":[{"name":"John Doe","role":"CEO","company":"ABC Corp","text":"Amazing service!","avatar":""},{"name":"Jane Smith","role":"Manager","company":"XYZ Inc","text":"Highly recommended!","avatar":""}],"autoPlay":true,"autoPlayInterval":5000,"slidesToShow":1,"slidesToScroll":1,"showArrows":true,"showDots":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"slidesToScroll":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}',
 15
),
(2, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle',
 '{"title":"Customer Reviews","testimonials":[{"name":"Alice Johnson","role":"Founder","company":"TechStart","text":"Exceptional quality!","avatar":""},{"name":"Bob Wilson","role":"Director","company":"GlobalTrade","text":"Fast delivery and great support.","avatar":""}],"autoPlay":true,"autoPlayInterval":4000,"slidesToShow":2,"slidesToScroll":1,"showArrows":true,"showDots":false}',
 '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"slidesToScroll":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}',
 15
),
(3, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle',
 '{"title":"Reviews","testimonials":[{"name":"Customer A","role":"Client","company":"","text":"Love it!","avatar":""}],"autoPlay":false,"slidesToShow":1,"showDots":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"slidesToScroll":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}',
 15
),
-- GALLERY BLOCK
(1, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images',
 '{"title":"Photo Gallery","images":[{"url":"https://via.placeholder.com/400x300","alt":"Image 1","title":"","description":""}],"layout":"grid","columns":3,"gap":"medium","lightbox":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}',
 16
),
-- Add gallery to more themes
(2, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images',
 '{"title":"Gallery","images":[],"layout":"grid","columns":4,"gap":"small","lightbox":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}',
 16
),
-- FAQ BLOCK
(1, 'faq', 'FAQ', 'Accordion frequently asked questions', 'help-circle',
 '{"title":"Frequently Asked Questions","faqs":[{"question":"What is your return policy?","answer":"We offer 30-day returns."},{"question":"How long does shipping take?","answer":"3-5 business days."}]}',
 '{"type":"object","properties":{"title":{"type":"string"},"faqs":{"type":"array","items":{"type":"object","properties":{"question":{"type":"string"},"answer":{"type":"string"}}}}}',
 17
),
(2, 'faq', 'FAQ', 'Accordion frequently asked questions', 'help-circle',
 '{"title":"Common Questions","faqs":[{"question":"How can I track my order?","answer":"Use the tracking link in your email."}],"allowMultipleOpen":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"faqs":{"type":"array","items":{"type":"object","properties":{"question":{"type":"string"},"answer":{"type":"string"}}}},"allowMultipleOpen":{"type":"boolean"}}}',
 17
),
-- TEAM BLOCK
(1, 'team', 'Team', 'Showcase team members', 'users',
 '{"title":"Meet Our Team","members":[{"name":"John Doe","role":"CEO","photo":"","bio":"Leader with 10 years experience","social":{"twitter":"","linkedin":""}}],"columns":3,"layout":"grid"}',
 '{"type":"object","properties":{"title":{"type":"string"},"members":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"photo":{"type":"string"},"bio":{"type":"string"},"social":{"type":"object","properties":{"twitter":{"type":"string"},"linkedin":{"type":"string"}}}}},"columns":{"type":"number","minimum":1,"maximum":4},"layout":{"type":"string","enum":["grid","list"]}}}',
 18
),
-- STATISTICS BLOCK
(1, 'statistics', 'Statistics', 'Animated number counters', 'bar-chart-2',
 '{"title":"Our Impact","statistics":[{"label":"Happy Customers","value":1000,"suffix":"+","color":"#6B46C1"},{"label":"Products Sold","value":500,"suffix":"K","color":"#10B981"}]}',
 '{"type":"object","properties":{"title":{"type":"string"},"statistics":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"value":{"type":"number"},"suffix":{"type":"string"},"color":{"type":"string"}}}}}',
 19
),
-- VIDEO BLOCK
(1, 'video', 'Video', 'Embed video from YouTube, Vimeo, or custom', 'video',
 '{"title":"Watch Our Story","videoUrl":"","provider":"youtube","autoplay":false,"controls":true,"loop":false,"muted":false,"aspectRatio":"16:9"}',
 '{"type":"object","properties":{"title":{"type":"string"},"videoUrl":{"type":"string","title":"Video URL"},"provider":{"type":"string","title":"Provider","enum":["youtube","vimeo","custom"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"loop":{"type":"boolean"},"muted":{"type":"boolean"},"aspectRatio":{"type":"string","title":"Aspect Ratio","enum":["16:9","4:3","1:1"]}}}',
 20
),
-- COUNTDOWN BLOCK
(1, 'countdown', 'Countdown', 'Countdown timer to a specific date', 'clock',
 '{"title":"Sale Ends In","targetDate":"2025-12-31T23:59:59","timezone":"UTC","showLabels":true,"style":"boxed","backgroundColor":"#6B46C1","textColor":"#ffffff"}',
 '{"type":"object","properties":{"title":{"type":"string"},"targetDate":{"type":"string","format":"date-time"},"timezone":{"type":"string"},"showLabels":{"type":"boolean"},"style":{"type":"string","enum":["boxed","outline","minimal"]},"backgroundColor":{"type":"string"},"textColor":{"type":"string"}}}',
 21
),
-- SOCIAL PROOF BLOCK
(1, 'socialProof', 'Social Proof', 'Trust badges, payment icons, social proofs', 'award',
 '{"title":"Trusted By","badges":[{"imageUrl":"https://via.placeholder.com/100x40?text=Badge1","alt":"Badge 1","link":""},{"imageUrl":"https://via.placeholder.com/100x40?text=Badge2","alt":"Badge 2","link":""}],"layout":"row","align":"center"}',
 '{"type":"object","properties":{"title":{"type":"string"},"badges":{"type":"array","items":{"type":"object","properties":{"imageUrl":{"type":"string"},"alt":{"type":"string"},"link":{"type":"string"}}}},"layout":{"type":"string","enum":["row","grid"]},"align":{"type":"string","enum":["left","center","right"]}}}',
 22
),
-- CUSTOM HTML BLOCK
(1, 'customHtml', 'Custom HTML', 'Insert custom HTML code', 'code',
 '{"html":"<div>Your HTML here</div>","sandbox":false,"allowScripts":false}',
 '{"type":"object","properties":{"html":{"type":"string","format":"textarea"},"sandbox":{"type":"boolean","title":"Sandbox (iframe isolation)"},"allowScripts":{"type":"boolean","title":"Allow Scripts (use with caution)"}}}',
 23
),
-- DIVIDER BLOCK
(1, 'divider', 'Divider', 'Horizontal divider line', 'minus',
 '{"style":"solid","color":"#e5e7eb","thickness":1,"margin":{"top":20,"bottom":20}}',
 '{"type":"object","properties":{"style":{"type":"string","enum":["solid","dashed","dotted"],"default":"solid"},"color":{"type":"string"},"thickness":{"type":"number"},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"bottom":{"type":"number"}}}}}',
 24
),
-- SPACER BLOCK
(1, 'spacer', 'Spacer', 'Vertical space', 'arrow-up-down',
 '{"height":40,"showInEditor":true}',
 '{"type":"object","properties":{"height":{"type":"number","title":"Height (px)"},"showInEditor":{"type":"boolean","title":"Show spacer line in editor","default":true}}}',
 25
),
-- CONTACT FORM BLOCK
(1, 'contactForm', 'Contact Form', 'Customer contact form with custom fields', 'mail',
 '{"title":"Contact Us","fields":[{"name":"name","label":"Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"message","label":"Message","type":"textarea","required":true}],"submitText":"Send Message","successMessage":"Thank you for contacting us!","recipientEmail":"store@example.com"}',
 '{"type":"object","properties":{"title":{"type":"string"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","textarea","phone","select"]},"required":{"type":"boolean"},"options":{"type":"array","items":{"type":"string"},"title":"Options for select"}}},"submitText":{"type":"string"},"successMessage":{"type":"string"},"recipientEmail":{"type":"string"}}}',
 26
),
-- MAP BLOCK
(1, 'map', 'Map', 'Google Maps embed', 'map',
 '{"title":"Our Location","address":"","latitude":"","longitude":"","zoom":15,"height":400,"apiKey":""}',
 '{"type":"object","properties":{"title":{"type":"string"},"address":{"type":"string"},"latitude":{"type":"number"},"longitude":{"type":"number"},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"number"},"apiKey":{"type":"string"}}}',
 27
),
-- TABS BLOCK
(1, 'tabs', 'Tabs', 'Tabbed content container', 'layout-tab',
 '{"tabs":[{"label":"Tab 1","content":"<p>Content for tab 1</p>"},{"label":"Tab 2","content":"<p>Content for tab 2</p>"}],"style":"underline","fullWidth":false}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"content":{"type":"string","format":"textarea"}}}},"style":{"type":"string","enum":["underline","boxed","pills"]},"fullWidth":{"type":"boolean"}}}',
 28
),
-- TIMELINE BLOCK
(1, 'timeline', 'Timeline', 'Vertical timeline with milestones', 'git-commit',
 '{"title":"Our Journey","items":[{"date":"2020","title":"Company Founded","description":"Started with a vision","icon":"star"},{"date":"2021","title":"First Product","description":"Launched our first product","icon":"package"}]}',
 '{"type":"object","properties":{"title":{"type":"string"},"items":{"type":"array","items":{"type":"object","properties":{"date":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"},"icon":{"type":"string"}}}},"orientation":{"type":"string","enum":["vertical","horizontal"],"default":"vertical"},"lineColor":{"type":"string"}}}',
 29
);

-- Add layout blocks to other themes (already done above with multiple inserts)
-- But also add some advanced blocks to other themes for variety
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
-- Modern theme: add advanced blocks
(2, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 15
),
(2, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 16
),
(2, 'grid', 'Grid', 'Flexible grid layout with customizable columns and rows', 'grid',
 '{"columns":3,"gap":"medium","autoFit":true,"minColumnWidth":250}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Fixed Columns (if autoFit false)","default":3},"gap":{"type":"string","title":"Gap","default":"medium","enum":["none","small","medium","large","xl"]},"autoFit":{"type":"boolean","title":"Auto-fit columns","default":true},"minColumnWidth":{"type":"number","title":"Minimum Column Width (px)","default":250}}}',
 17
),
(2, 'contactForm', 'Contact Form', 'Customer contact form with custom fields', 'mail',
 '{"title":"Get in Touch","fields":[{"name":"name","label":"Name","type":"text","required":true},{"name":"email","label":"Email","type":"email","required":true},{"name":"subject","label":"Subject","type":"text","required":true},{"name":"message","label":"Message","type":"textarea","required":true}],"submitText":"Send Message","successMessage":"Thanks for reaching out! We will get back to you soon."}',
 '{"type":"object","properties":{"title":{"type":"string"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","textarea","phone","select"]},"required":{"type":"boolean"},"options":{"type":"array","items":{"type":"string"}}}},"submitText":{"type":"string"},"successMessage":{"type":"string"}}}',
 18
),
(2, 'team', 'Team', 'Showcase team members', 'users',
 '{"title":"Our Team","members":[{"name":"Team Member","role":"Position","photo":"","bio":"","social":{"twitter":"","linkedin":""}}],"columns":4,"layout":"grid"}',
 '{"type":"object","properties":{"title":{"type":"string"},"members":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"photo":{"type":"string"},"bio":{"type":"string"},"social":{"type":"object","properties":{"twitter":{"type":"string"},"linkedin":{"type":"string"}}}}},"columns":{"type":"number","minimum":1,"maximum":4},"layout":{"type":"string","enum":["grid","list"]}}}',
 19
);

-- Minimal theme: add layout blocks (already done), and some advanced
(3, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images',
 '{"title":"Gallery","images":[],"layout":"masonry","columns":3,"gap":"small","lightbox":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}',
 12
),
(3, 'video', 'Video', 'Embed video from YouTube, Vimeo, or custom', 'video',
 '{"title":"Video","videoUrl":"","provider":"youtube","autoplay":false,"controls":true,"aspectRatio":"16:9"}',
 '{"type":"object","properties":{"title":{"type":"string"},"videoUrl":{"type":"string","title":"Video URL"},"provider":{"type":"string","title":"Provider","enum":["youtube","vimeo","custom"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"loop":{"type":"boolean"},"muted":{"type":"boolean"},"aspectRatio":{"type":"string","title":"Aspect Ratio","enum":["16:9","4:3","1:1"]}}}',
 13
);

-- Premium theme: add all advanced blocks
(4, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":40,"right":0,"bottom":40,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 15
),
(4, 'columns', 'Columns', 'Create multi-column layout (2, 3, 4, or custom)', 'columns',
 '{"columns":2,"gap":"medium","columnWidths":[],"stackOnMobile":true}',
 '{"type":"object","properties":{"columns":{"type":"number","title":"Number of Columns","minimum":1,"maximum":6,"default":2},"gap":{"type":"string","title":"Gap Between Columns","default":"medium","enum":["none","small","medium","large","xl"]},"columnWidths":{"type":"array","title":"Custom Widths (%) - optional","items":{"type":"string"}},"stackOnMobile":{"type":"boolean","title":"Stack on Mobile","default":true}}}',
 16
),
(4, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle',
 '{"title":"Testimonials","testimonials":[{"name":"Client","role":"Customer","company":"","text":"Great service!","avatar":""}],"autoPlay":true,"slidesToShow":1}',
 '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"showDots":{"type":"boolean"}}}',
 17
),
(4, 'gallery', 'Gallery', 'Image gallery with lightbox (grid/masonry)', 'images',
 '{"title":"Gallery","images":[],"layout":"grid","columns":4,"gap":"small","lightbox":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"images":{"type":"array","items":{"type":"object","properties":{"url":{"type":"string"},"alt":{"type":"string"},"title":{"type":"string"},"description":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","masonry"]},"columns":{"type":"number","minimum":1,"maximum":6},"gap":{"type":"string","enum":["none","small","medium","large","xl"]},"lightbox":{"type":"boolean"}}}',
 18
);

-- Diamond theme: add layout blocks and advanced
(5, 'section', 'Section', 'Full-width container with customizable background and padding', 'layout',
 '{"layout":"full-width","backgroundType":"color","backgroundColor":"#ffffff","padding":{"top":60,"right":0,"bottom":60,"left":0},"margin":{"top":0,"right":0,"bottom":0,"left":0}}',
 '{"type":"object","properties":{"layout":{"type":"string","title":"Layout","default":"full-width","enum":["full-width","boxed","container"]},"backgroundType":{"type":"string","title":"Background Type","enum":["color","image","gradient"]},"backgroundColor":{"type":"string","title":"Background Color"},"backgroundImage":{"type":"string","title":"Background Image URL"},"backgroundGradient":{"type":"string","title":"CSS Gradient"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}}}}',
 11
),
(5, 'container', 'Container', 'Boxed container with max-width for centered content', 'square',
 '{"maxWidth":"1400","alignment":"center","padding":{"top":40,"right":40,"bottom":40,"left":40},"margin":{"top":0,"right":"auto","bottom":0,"left":"auto"}}',
 '{"type":"object","properties":{"maxWidth":{"type":"string","title":"Max Width (px or %)","default":"1200"},"alignment":{"type":"string","title":"Horizontal Alignment","enum":["left","center","right"],"default":"center"},"padding":{"type":"object","title":"Padding (px)","properties":{"top":{"type":"number"},"right":{"type":"number"},"bottom":{"type":"number"},"left":{"type":"number"}}},"margin":{"type":"object","title":"Margin (px)","properties":{"top":{"type":"number"},"right":{"type":"string"},"bottom":{"type":"number"},"left":{"type":"string"}}}}}',
 12
),
(5, 'testimonials', 'Testimonials', 'Customer testimonials carousel/slider', 'message-circle',
 '{"title":"VIP Testimonials","testimonials":[{"name":"VIP Client","role":"Director","company":"Luxury Corp","text":"Outstanding quality and service!","avatar":""}],"autoPlay":false,"slidesToShow":1,"showArrows":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"testimonials":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"role":{"type":"string"},"company":{"type":"string"},"text":{"type":"string"},"avatar":{"type":"string"}}}},"autoPlay":{"type":"boolean"},"autoPlayInterval":{"type":"number"},"slidesToShow":{"type":"number"},"showArrows":{"type":"boolean"},"showDots":{"type":"boolean"}}}',
 15
),
(5, 'statistics', 'Statistics', 'Animated number counters', 'bar-chart-2',
 '{"title":"Our Achievements","statistics":[{"label":"Awards","value":50,"suffix":"+","color":"#C0A062"},{"label":"Global Clients","value":200,"suffix":"","color":"#6B46C1"}]}',
 '{"type":"object","properties":{"title":{"type":"string"},"statistics":{"type":"array","items":{"type":"object","properties":{"label":{"type":"string"},"value":{"type":"number"},"suffix":{"type":"string"},"color":{"type":"string"}}}}}',
 16
);

SET FOREIGN_KEY_CHECKS = 1;
