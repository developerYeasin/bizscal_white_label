-- Add advanced page builder blocks to all themes
-- This script adds the new block types: tabs, testimonials, countdown, video, contact, map

SET FOREIGN_KEY_CHECKS = 0;

-- Advanced blocks for Theme 1 (Basic)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(1, 'tabs', 'Tabs', 'Tabbed content container', NULL,
 '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
 10
),
(1, 'testimonials', 'Testimonials', 'Customer testimonials', NULL,
 '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
 '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
 11
),
(1, 'countdown', 'Countdown Timer', 'Countdown to a date', NULL,
 '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
 '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
 12
),
(1, 'video', 'Video', 'Embedded video player', NULL,
 '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
 '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
 13
),
(1, 'contact', 'Contact Form', 'Contact form block', NULL,
 '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
 14
),
(1, 'map', 'Map', 'Interactive map', NULL,
 '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
 '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
 15
);

-- Advanced blocks for Theme 2 (Modern)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(2, 'tabs', 'Tabs', 'Tabbed content container', NULL,
 '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
 5
),
(2, 'testimonials', 'Testimonials', 'Customer testimonials', NULL,
 '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
 '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
 6
),
(2, 'countdown', 'Countdown Timer', 'Countdown to a date', NULL,
 '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
 '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
 7
),
(2, 'video', 'Video', 'Embedded video player', NULL,
 '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
 '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
 8
),
(2, 'contact', 'Contact Form', 'Contact form block', NULL,
 '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
 9
),
(2, 'map', 'Map', 'Interactive map', NULL,
 '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
 '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
 10
);

-- Advanced blocks for Theme 3 (Minimal)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(3, 'tabs', 'Tabs', 'Tabbed content container', NULL,
 '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
 4
),
(3, 'testimonials', 'Testimonials', 'Customer testimonials', NULL,
 '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
 '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
 5
),
(3, 'countdown', 'Countdown Timer', 'Countdown to a date', NULL,
 '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
 '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
 6
),
(3, 'video', 'Video', 'Embedded video player', NULL,
 '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
 '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
 7
),
(3, 'contact', 'Contact Form', 'Contact form block', NULL,
 '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
 8
),
(3, 'map', 'Map', 'Interactive map', NULL,
 '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
 '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
 9
);

-- Advanced blocks for Theme 4 (Premium)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(4, 'tabs', 'Tabs', 'Tabbed content container', NULL,
 '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
 5
),
(4, 'testimonials', 'Testimonials', 'Customer testimonials', NULL,
 '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
 '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
 6
),
(4, 'countdown', 'Countdown Timer', 'Countdown to a date', NULL,
 '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
 '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
 7
),
(4, 'video', 'Video', 'Embedded video player', NULL,
 '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
 '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
 8
),
(4, 'contact', 'Contact Form', 'Contact form block', NULL,
 '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
 9
),
(4, 'map', 'Map', 'Interactive map', NULL,
 '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
 '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
 10
);

-- Advanced blocks for Theme 5 (Diamond)
INSERT INTO `theme_blocks` (`theme_id`, `block_type`, `title`, `description`, `icon`, `default_config`, `config_schema`, `sort_order`) VALUES
(5, 'tabs', 'Tabs', 'Tabbed content container', NULL,
 '{"tabs":[{"id":"tab1","title":"Tab 1","content":"Content for tab 1"},{"id":"tab2","title":"Tab 2","content":"Content for tab 2"}],"layout":"horizontal","variant":"default"}',
 '{"type":"object","properties":{"tabs":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"title":{"type":"string"},"content":{"type":"string"}}}},"layout":{"type":"string","enum":["horizontal","vertical"]},"variant":{"type":"string","enum":["default","card","pills"]}}}',
 5
),
(5, 'testimonials', 'Testimonials', 'Customer testimonials', NULL,
 '{"testimonials":[{"id":"t1","name":"John Doe","role":"Satisfied Customer","content":"This product changed my life! Highly recommend.","rating":5,"avatar":""}],"layout":"grid","columns":2,"showAvatar":true,"showRating":true}',
 '{"type":"object","properties":{"testimonials":{"type":"array","items":{"type":"object","properties":{"id":{"type":"string"},"name":{"type":"string"},"role":{"type":"string"},"content":{"type":"string"},"rating":{"type":"number"},"avatar":{"type":"string"}}}},"layout":{"type":"string","enum":["grid","featured"]},"columns":{"type":"number"},"showAvatar":{"type":"boolean"},"showRating":{"type":"boolean"}}}',
 6
),
(5, 'countdown', 'Countdown Timer', 'Countdown to a date', NULL,
 '{"targetDate":"","style":"minimal","layout":"compact","labels":{"days":"Days","hours":"Hours","minutes":"Minutes","seconds":"Seconds"}}',
 '{"type":"object","properties":{"targetDate":{"type":"string","format":"date-time"},"style":{"type":"string","enum":["minimal","card","gradient"]},"layout":{"type":"string","enum":["compact","expanded"]},"labels":{"type":"object","properties":{"days":{"type":"string"},"hours":{"type":"string"},"minutes":{"type":"string"},"seconds":{"type":"string"}}}}}',
 7
),
(5, 'video', 'Video', 'Embedded video player', NULL,
 '{"videoUrl":"","type":"youtube","aspectRatio":"16:9","autoplay":false,"controls":true,"muted":false}',
 '{"type":"object","properties":{"videoUrl":{"type":"string"},"type":{"type":"string","enum":["youtube","vimeo","mp4"]},"aspectRatio":{"type":"string","enum":["16:9","4:3","1:1"]},"autoplay":{"type":"boolean"},"controls":{"type":"boolean"},"muted":{"type":"boolean"}}}',
 8
),
(5, 'contact', 'Contact Form', 'Contact form block', NULL,
 '{"title":"Contact Us","description":"Have questions? Reach out!","emailTo":"","fields":[],"submitLabel":"Send Message","showNameFields":true}',
 '{"type":"object","properties":{"title":{"type":"string"},"description":{"type":"string"},"emailTo":{"type":"string","format":"email"},"fields":{"type":"array","items":{"type":"object","properties":{"name":{"type":"string"},"label":{"type":"string"},"type":{"type":"string","enum":["text","email","phone","textarea"]},"required":{"type":"boolean"},"placeholder":{"type":"string"}}}},"submitLabel":{"type":"string"},"showNameFields":{"type":"boolean"}}}',
 9
),
(5, 'map', 'Map', 'Interactive map', NULL,
 '{"provider":"openstreetmap","center":{"lat":0,"lng":0},"zoom":14,"height":"400px","markers":[]}',
 '{"type":"object","properties":{"provider":{"type":"string","enum":["openstreetmap","google"]},"center":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"}}},"zoom":{"type":"number","minimum":1,"maximum":20},"height":{"type":"string"},"markers":{"type":"array","items":{"type":"object","properties":{"lat":{"type":"number"},"lng":{"type":"number"},"label":{"type":"string"},"info":{"type":"string"}}}}}}',
 10
);

SET FOREIGN_KEY_CHECKS = 1;
