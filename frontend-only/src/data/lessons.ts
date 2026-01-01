import type { Language } from '../i18n';
import { localizeString, type LocalizedString } from '../i18n/localize';

const ls = (en: string, ru: string, tg: string): LocalizedString => ({ en, ru, tg });

export type LocalizedLesson = {
  id: string;
  title: LocalizedString;
  learn: {
    text: LocalizedString;
    details?: LocalizedString[];
    summary?: LocalizedString[];
    code?: string;
  };
  quizIds: string[];
};

export type Lesson = {
  id: string;
  title: string;
  learn: {
    text: string;
    details?: string[];
    summary?: string[];
    code?: string;
  };
  quizIds: string[];
};

export const QUIZZES_PER_LESSON = 10;

const makeQuizIds = (lessonId: string) =>
  Array.from({ length: QUIZZES_PER_LESSON }, (_, i) => `${lessonId}-q${String(i + 1).padStart(2, '0')}`);

export const lessons: LocalizedLesson[] = [
  {
    id: 'l01-html-intro',
    title: ls('Lesson 1: Intro to HTML', 'Урок 1: Введение в HTML', 'Дарс 1: Муқаддима ба HTML'),
    learn: {
      text: ls(
        'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements represented by tags.',
        'HTML (HyperText Markup Language) — это стандартный язык разметки для создания веб-страниц. Он описывает структуру страницы с помощью тегов.',
        'HTML (HyperText Markup Language) — забони стандартии нишонгузорӣ барои сохтани саҳифаҳои веб аст. Он сохтори саҳифаро бо ёрии тегҳо тавсиф мекунад.',
      ),
      details: [
        ls(
          'Tags usually come in pairs: <tag>content</tag>.',
          'Теги обычно идут парами: <tag>контент</tag>.',
          'Тегҳо одатан ҷуфранд: <tag>мӯҳтаво</tag>.',
        ),
        ls(
          '<!DOCTYPE html> defines the document type as HTML5.',
          '<!DOCTYPE html> определяет тип документа как HTML5.',
          '<!DOCTYPE html> намуди ҳуҷҷатро ҳамчун HTML5 муайян мекунад.',
        ),
        ls(
          '<html> is the root element.',
          '<html> — корневой элемент.',
          '<html> — унсури решагӣ аст.',
        ),
      ],
      summary: [
        ls('HTML builds the structure.', 'HTML строит структуру.', 'HTML сохторро месозад.'),
        ls('Tags delimit elements.', 'Теги разделяют элементы.', 'Тегҳо унсурҳоро ҷудо мекунанд.'),
      ],
      code: `<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
    },
    quizIds: makeQuizIds('l01-html-intro'),
  },
  {
    id: 'l02-html-structure',
    title: ls('Lesson 2: Basic Tags', 'Урок 2: Основные теги', 'Дарс 2: Тегҳои асосӣ'),
    learn: {
      text: ls(
        'Headings are defined with <h1> to <h6>. Paragraphs use <p>. Line breaks use <br> (an empty tag).',
        'Заголовки задаются от <h1> до <h6>. Параграфы используют <p>. Разрывы строк — <br>.',
        'Сарлавҳаҳо аз <h1> то <h6> мебошанд. Параграфҳо <p>-ро истифода мебаранд. <br> барои гузариш ба сатри нав.',
      ),
      details: [
        ls(
          '<h1> is the most important heading.',
          '<h1> — самый важный заголовок.',
          '<h1> — муҳимтарин сарлавҳа аст.',
        ),
        ls(
          '<p> adds spacing before and after text.',
          '<p> добавляет отступы до и после текста.',
          '<p> пеш ва пас аз матн фосила илова мекунад.',
        ),
        ls(
          '<hr> creates a horizontal rule (line).',
          '<hr> создает горизонтальную линию.',
          '<hr> хати уфуқӣ месозад.',
        ),
      ],
      summary: [
        ls('Use h1-h6 for structure.', 'Используйте h1-h6 для структуры.', 'Барои сохтор h1-h6-ро истифода баред.'),
        ls('Tags like <br> constitute void elements.', 'Теги вроде <br> — пустые.', 'Тегҳо ба монанди <br> холӣ ҳастанд.'),
      ],
      code: `<h1>Main Title</h1>
<p>This is a paragraph.</p>
<p>Another paragraph.</p>`,
    },
    quizIds: makeQuizIds('l02-html-structure'),
  },
  {
    id: 'l03-formatting',
    title: ls('Lesson 3: Text Formatting', 'Урок 3: Форматирование', 'Дарс 3: Форматкунӣ'),
    learn: {
      text: ls(
        'HTML provides tags to format text. <b> makes text bold, <i> makes it italic. <strong> and <em> convey semantic importance.',
        'HTML предлагает теги для формата. <b> делает жирным, <i> — курсивом. <strong> и <em> важны семантически.',
        'HTML тегҳо барои формат дорад. <b> ғафс мекунад, <i> — каҷ. <strong> ва <em> маънои муҳим доранд.',
      ),
      details: [
        ls(
          '<b>: Bold text (visual).',
          '<b>: Жирный текст (визуально).',
          '<b>: Матни ғафс (визуалӣ).',
        ),
        ls(
          '<strong>: Important text (usually bold).',
          '<strong>: Важный текст (обычно жирный).',
          '<strong>: Матни муҳим (одатан ғафс).',
        ),
        ls(
          '<small>: Smaller text.',
          '<small>: Уменьшенный текст.',
          '<small>: Матни хурдтар.',
        ),
      ],
      summary: [
        ls('Use strong/em for meaning.', 'Используйте strong/em для смысла.', 'Барои маъно strong/em-ро истифода баред.'),
        ls('Use b/i for style.', 'Используйте b/i для стиля.', 'Барои услуб b/i-ро истифода баред.'),
      ],
      code: `<p>This is <b>bold</b> and <i>italic</i>.</p>
<p>This is <strong>important</strong>!</p>`,
    },
    quizIds: makeQuizIds('l03-formatting'),
  },
  {
    id: 'l04-lists-links',
    title: ls('Lesson 4: Lists & Links', 'Урок 4: Списки и ссылки', 'Дарс 4: Рӯйхатҳо ва пайвандҳо'),
    learn: {
      text: ls(
        'Lists organizes data. <ul> is unordered (bullets), <ol> is ordered (numbers). <a> creates hyperlinks.',
        'Списки организуют данные. <ul> — маркированный, <ol> — нумерованный. <a> создает ссылки.',
        'Рӯйхатҳо маълумотро ташкил медиҳанд. <ul> — бетартиб, <ol> — рақамгузоришуда. <a> пайванд месозад.',
      ),
      details: [
        ls(
          '<li> defines a list item.',
          '<li> определяет элемент списка.',
          '<li> унсури рӯйхатро муайян мекунад.',
        ),
        ls(
          '<a> uses the href attribute for the URL.',
          '<a> использует атрибут href для URL.',
          '<a> атрибути href-ро барои URL истифода мебарад.',
        ),
        ls(
          'target="_blank" opens link in new tab.',
          'target="_blank" открывает в новой вкладке.',
          'target="_blank" дар варақаи нав мекушояд.',
        ),
      ],
      summary: [
        ls('ul/ol contain li.', 'ul/ol содержат li.', 'ul/ol дорои li мебошанд.'),
        ls('href is required for links.', 'href обязателен для ссылок.', 'href барои пайвандҳо ҳатмист.'),
      ],
      code: `<ul>
  <li>Apple</li>
  <li>Banana</li>
</ul>
<a href="https://google.com">Google</a>`,
    },
    quizIds: makeQuizIds('l04-lists-links'),
  },
  {
    id: 'l05-media',
    title: ls('Lesson 5: Images & Media', 'Урок 5: Изображения', 'Дарс 5: Тасвирҳо'),
    learn: {
      text: ls(
        'Images are embedded with the <img> tag. It is empty and contains attributes only. "src" specifies the path, "alt" provides text for screen readers.',
        'Изображения вставляются тегом <img>. Он пустой. "src" — путь, "alt" — текст для читалок.',
        'Тасвирҳо бо <img> гузошта мешаванд. Он холӣ аст. "src" — роҳ, "alt" — матн барои хонандагон.',
      ),
      details: [
        ls(
          'Width and height attributes set size.',
          'Атрибуты width и height задают размер.',
          'Атрибутҳои width ва height андозаро мемонанд.',
        ),
        ls(
          'Use absolute or relative paths in src.',
          'Используйте абсолютные или относительные пути.',
          'Роҳҳои мутлақ ё нисбиро истифода баред.',
        ),
        ls(
          '<video> and <audio> are for multimedia.',
          '<video> и <audio> для мультимедиа.',
          '<video> ва <audio> барои мултимедия.',
        ),
      ],
      summary: [
        ls('Always use alt text.', 'Всегда пишите alt.', 'Ҳамеша alt-ро нависед.'),
        ls('img tags are self-closing.', 'img не закрывается.', 'img худпӯшанда аст.'),
      ],
      code: `<img src="logo.png" alt="Company Logo" width="100">`,
    },
    quizIds: makeQuizIds('l05-media'),
  },
  {
    id: 'l06-css-intro',
    title: ls('Lesson 6: Intro to CSS', 'Урок 6: Введение в CSS', 'Дарс 6: Муқаддима ба CSS'),
    learn: {
      text: ls(
        'CSS (Cascading Style Sheets) formats the layout of a webpage. You can control color, font, size, and spacing.',
        'CSS (Cascading Style Sheets) форматирует макет страницы. Вы управляете цветом, шрифтом и отступами.',
        'CSS (Cascading Style Sheets) намуди саҳифаро формат мекунад. Шумо ранг, шрифт ва фосиларо идора мекунед.',
      ),
      details: [
        ls(
          'Inline CSS: style attribute inside tags.',
          'Встроенный CSS: атрибут style в тегах.',
          'CSS-и дохилӣ: атрибути style дар тегҳо.',
        ),
        ls(
          'Internal CSS: <style> tag in <head>.',
          'Внутренний CSS: тег <style> в <head>.',
          'CSS-и дохилӣ: теги <style> дар <head>.',
        ),
        ls(
          'External CSS: <link> to .css file (Best).',
          'Внешний CSS: <link> на .css файл (Лучшее).',
          'CSS-и берунӣ: <link> ба файли .css (Беҳтарин).',
        ),
      ],
      summary: [
        ls('CSS styles HTML elements.', 'CSS стилизует HTML.', 'CSS элементҳои HTML-ро оро медиҳад.'),
        ls('Prefer external stylesheets.', 'Предпочитайте внешние стили.', 'Стилҳои беруниро афзал донед.'),
      ],
      code: `/* style.css */
body {
  background-color: lightblue;
}
h1 {
  color: white;
  text-align: center;
}`,
    },
    quizIds: makeQuizIds('l06-css-intro'),
  },
  {
    id: 'l07-selectors',
    title: ls('Lesson 7: CSS Selectors', 'Урок 7: Селекторы CSS', 'Дарс 7: Селекторҳои CSS'),
    learn: {
      text: ls(
        'Selectors allow you to select and manipulate HTML elements. Common ones are Element, ID, and Class selectors.',
        'Селекторы позволяют выбирать элементы HTML. Основные: по тегу, ID и классу.',
        'Селекторҳо имкон медиҳанд элементҳои HTML-ро интихоб кунед. Асосӣ: тег, ID ва класс.',
      ),
      details: [
        ls(
          'Element: p { color: red; } selects all <p>.',
          'Тег: p { color: red; } выбирает все <p>.',
          'Тег: p { color: red; } ҳамаи <p>-ро интихоб мекунад.',
        ),
        ls(
          'ID: #header { ... } selects id="header". Unique.',
          'ID: #header { ... } для id="header". Уникален.',
          'ID: #header { ... } барои id="header". Ягона.',
        ),
        ls(
          'Class: .btn { ... } selects class="btn". Reusable.',
          'Класс: .btn { ... } для class="btn". Многоразовый.',
          'Класс: .btn { ... } барои class="btn". Такроршаванда.',
        ),
      ],
      summary: [
        ls('ID starts with #.', 'ID начинается с #.', 'ID бо # оғоз мешавад.'),
        ls('Class starts with .', 'Класс начинается с .', 'Класс бо . оғоз мешавад.'),
      ],
      code: `.center {
  text-align: center;
}
#unique {
  color: blue;
}`,
    },
    quizIds: makeQuizIds('l07-selectors'),
  },
  {
    id: 'l08-box-model',
    title: ls('Lesson 8: Box Model', 'Урок 8: Блочная модель', 'Дарс 8: Модели блокӣ'),
    learn: {
      text: ls(
        'All HTML elements can be considered as boxes. The Box Model wraps content with Margins, Borders, Padding, and Content.',
        'Все элементы HTML — это прямоугольники. Box Model окружает контент отступами, границами и полями.',
        'Ҳама элементҳои HTML қуттиҳоянд. Box Model мӯҳтавои бо ҳошияҳо, сарҳадҳо ва фосилаҳо мепечонад.',
      ),
      details: [
        ls(
          'Content: The text/image.',
          'Content: Текст или картинка.',
          'Content: Матн ё тасвир.',
        ),
        ls(
          'Padding: Space around content (inside border).',
          'Padding: Поле вокруг контента (внутри границы).',
          'Padding: Фосила дар атрофи мӯҳтаво (дохили сарҳад).',
        ),
        ls(
          'Border: Border around padding.',
          'Border: Граница вокруг padding.',
          'Border: Сарҳад дар атрофи padding.',
        ),
        ls(
          'Margin: Space outside border.',
          'Margin: Отступ снаружи границы.',
          'Margin: Фосилаи берун аз сарҳад.',
        ),
      ],
      summary: [
        ls('Padding is inside.', 'Padding внутри.', 'Padding дар дохил аст.'),
        ls('Margin is outside.', 'Margin снаружи.', 'Margin дар берун аст.'),
      ],
      code: `div {
  width: 300px;
  border: 5px solid gray;
  padding: 20px;
  margin: 10px;
}`,
    },
    quizIds: makeQuizIds('l08-box-model'),
  },
  {
    id: 'l09-fonts',
    title: ls('Lesson 9: Fonts & Text', 'Урок 9: Шрифты', 'Дарс 9: Шрифтҳо'),
    learn: {
      text: ls(
        'CSS offers powerful text styling. You can change the font family, size, weight, alignment, and decoration.',
        'CSS мощно стилизует текст. Можно менять семейство, размер, вес, выравнивание и декор.',
        'CSS матнро хуб оро медиҳад. Оила, андоза, вазн ва ҷойгиршавиро тағйир додан мумкин аст.',
      ),
      details: [
        ls(
          'font-family: "Arial", sans-serif;',
          'font-family: "Arial", sans-serif;',
          'font-family: "Arial", sans-serif;',
        ),
        ls(
          'font-size: 16px; (or rem/em)',
          'font-size: 16px; (или rem/em)',
          'font-size: 16px; (ё rem/em)',
        ),
        ls(
          'color: #333; (hex codes)',
          'color: #333; (hex коды)',
          'color: #333; (кодҳои hex)',
        ),
      ],
      summary: [
        ls('Use generic families as fallback.', 'Указывайте запасные шрифты.', 'Шрифтҳои захиравиро истифода баред.'),
        ls('rem is relative to root.', 'rem относителен корню.', 'rem нисбат ба реша аст.'),
      ],
      code: `body {
  font-family: Helvetica, sans-serif;
  font-size: 1rem;
  color: darkblue;
}`,
    },
    quizIds: makeQuizIds('l09-fonts'),
  },
  {
    id: 'l10-flexbox',
    title: ls('Lesson 10: Flexbox', 'Урок 10: Flexbox', 'Дарс 10: Flexbox'),
    learn: {
      text: ls(
        'Flexbox is a layout module used to arrange items in rows or columns without floats. It creates flexible responsive layouts.',
        'Flexbox — модуль макета для размещения элементов в строки или столбцы без float. Создает гибкие макеты.',
        'Flexbox модули макет барои ҷойгиркунии унсурҳо дар сатр ё сутун аст. Макетҳои чандир месозад.',
      ),
      details: [
        ls(
          'display: flex; on parent.',
          'display: flex; на родителе.',
          'display: flex; дар волид.',
        ),
        ls(
          'justify-content: center; (horizontal align)',
          'justify-content: center; (горизонталь)',
          'justify-content: center; (уфуқӣ)',
        ),
        ls(
          'align-items: center; (vertical align)',
          'align-items: center; (вертикаль)',
          'align-items: center; (амудӣ)',
        ),
      ],
      summary: [
        ls('Flex aligns 1D layouts.', 'Flex выравнивает 1D макеты.', 'Flex макетҳои 1D-ро рост мекунад.'),
        ls('Controls spacing easily.', 'Легко управляет отступами.', 'Фосилаҳоро осон идора мекунад.'),
      ],
      code: `.container {
  display: flex;
  justify-content: space-between;
}`,
    },
    quizIds: makeQuizIds('l10-flexbox'),
  },
  {
    id: 'l11-grid',
    title: ls('Lesson 11: CSS Grid', 'Урок 11: CSS Grid', 'Дарс 11: CSS Grid'),
    learn: {
      text: ls(
        'CSS Grid Layout is a 2-dimensional system, handling both columns and rows. It is perfect for page-wide layouts.',
        'CSS Grid — это 2D система для строк и столбцов. Идеальна для макета всей страницы.',
        'CSS Grid системаи 2D барои сатр ва сутунҳост. Барои макети саҳифа комил аст.',
      ),
      details: [
        ls(
          'display: grid;',
          'display: grid;',
          'display: grid;',
        ),
        ls(
          'grid-template-columns: 100px auto;',
          'grid-template-columns: 100px auto;',
          'grid-template-columns: 100px auto;',
        ),
        ls(
          'gap: 10px; sets spacing.',
          'gap: 10px; задает отступы.',
          'gap: 10px; фосила мегузорад.',
        ),
      ],
      summary: [
        ls('Grid is for 2D layouts.', 'Grid для 2D макетов.', 'Grid барои макетҳои 2D аст.'),
        ls('More powerful than flexbox.', 'Мощнее, чем flexbox.', 'Аз flexbox пурқувваттар аст.'),
      ],
      code: `.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
}`,
    },
    quizIds: makeQuizIds('l11-grid'),
  },
  {
    id: 'l12-responsive',
    title: ls('Lesson 12: Responsive Design', 'Урок 12: Адаптивность', 'Дарс 12: Адаптивность'),
    learn: {
      text: ls(
        'Responsive Web Design makes web pages render well on all devices. Media queries (@media) allow you to apply different styles for different screen sizes.',
        'Адаптивный дизайн делает страницы удобными на всех устройствах. Media queries (@media) меняют стиль от размера экрана.',
        'Дизайни адаптивӣ саҳифаро дар ҳама дастгоҳҳо хуб нишон медиҳад. Media queries (@media) услубро вобаста ба андозаи экран иваз мекунанд.',
      ),
      details: [
        ls(
          '@media only screen and (max-width: 600px) { ... }',
          '@media only screen and (max-width: 600px) { ... }',
          '@media only screen and (max-width: 600px) { ... }',
        ),
        ls(
          'Use percentages % for width.',
          'Используйте % для ширины.',
          'Барои васеъгӣ % истифода баред.',
        ),
        ls(
          'Viewport meta tag is essential.',
          'Meta tag viewport обязателен.',
          'Теги meta viewport ҳатмист.',
        ),
      ],
      summary: [
        ls('Mobile first approach.', 'Сначала мобильные.', 'Аввал мобилӣ.'),
        ls('Breakpoints change layout.', 'Брейкпоинты меняют макет.', 'Нуқтаҳои гузариш макетро иваз мекунанд.'),
      ],
      code: `@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}`,
    },
    quizIds: makeQuizIds('l12-responsive'),
  },
  {
    id: 'l13-input-forms',
    title: ls('Lesson 13: Advanced Forms', 'Урок 13: Сложные формы', 'Дарс 13: Формаҳои мураккаб'),
    learn: {
      text: ls(
        'Forms allow user input. <input> has many types like text, password, checkbox, radio, date. <select> makes dropdowns.',
        'Формы принимают ввод. <input> имеет типы: text, password, checkbox, radio. <select> — выпадающие списки.',
        'Формаҳо воридотро қабул мекунанд. <input> намудҳои text, password, checkbox дорад. <select> рӯйхати кушодашаванда аст.',
      ),
      details: [
        ls(
          '<input type="radio"> for single choice.',
          '<input type="radio"> для одного выбора.',
          '<input type="radio"> барои як интихоб.',
        ),
        ls(
          '<textarea> for multiline text.',
          '<textarea> для многострочного текста.',
          '<textarea> барои матни бисёрсатра.',
        ),
        ls(
          '<button>Submit</button>',
          '<button>Отправить</button>',
          '<button>Фиристодан</button>',
        ),
      ],
      summary: [
        ls('Labels improve accessibility.', 'Label улучшает доступность.', 'Label дастрасиро беҳтар мекунад.'),
        ls('Use proper input types.', 'Используйте верные типы.', 'Намудҳои дурустро истифода баред.'),
      ],
      code: `<form>
  <label for="fname">Name:</label>
  <input type="text" id="fname" name="fname">
</form>`,
    },
    quizIds: makeQuizIds('l13-input-forms'),
  },
  {
    id: 'l14-semantic',
    title: ls('Lesson 14: Semantic HTML', 'Урок 14: Семантика', 'Дарс 14: Семантика'),
    learn: {
      text: ls(
        'Semantic elements clearly describe their meaning to both the browser and the developer. Examples: <header>, <footer>, <article>, <section>.',
        'Семантические элементы описывают свой смысл. Примеры: <header>, <footer>, <article>.',
        'Унсурҳои семантикӣ маънояшонро тавсиф мекунанд. Мисолҳо: <header>, <footer>, <article>.',
      ),
      details: [
        ls(
          '<nav> for navigation links.',
          '<nav> для навигации.',
          '<nav> барои паймоиш.',
        ),
        ls(
          '<main> for main content.',
          '<main> для основного контента.',
          '<main> барои мӯҳтавои асосӣ.',
        ),
        ls(
          'Helps SEO and screen readers.',
          'Помогает SEO и читалкам.',
          'Ба SEO ва хонандагон ёрӣ медиҳад.',
        ),
      ],
      summary: [
        ls('Don\'t use div for everything.', 'Не используйте везде div.', 'Барои ҳама чиз div истифода набаред.'),
        ls('Structure implies meaning.', 'Структура несет смысл.', 'Сохтор маъно дорад.'),
      ],
      code: `<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>`,
    },
    quizIds: makeQuizIds('l14-semantic'),
  },
];

export const LESSON_ORDER = lessons.map((lesson, index) => ({ id: lesson.id, index: index + 1 }));

const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));

const quizMetaById = new Map<
  string,
  { lessonId: string; lessonIndex: number; quizIndex: number }
>();
const quizOrder: string[] = [];

lessons.forEach((lesson, lessonIndex) => {
  lesson.quizIds.forEach((quizId, quizIndex) => {
    quizMetaById.set(quizId, {
      lessonId: lesson.id,
      lessonIndex: lessonIndex + 1,
      quizIndex: quizIndex + 1,
    });
    quizOrder.push(quizId);
  });
});

export const localizeLesson = (lesson: LocalizedLesson, lang: Language): Lesson => ({
  id: lesson.id,
  title: localizeString(lesson.title, lang),
  learn: {
    text: localizeString(lesson.learn.text, lang),
    details: lesson.learn.details?.map((line) => localizeString(line, lang)),
    summary: lesson.learn.summary?.map((line) => localizeString(line, lang)),
    code: lesson.learn.code,
  },
  quizIds: [...lesson.quizIds],
});

export const getLessons = (lang: Language): Lesson[] =>
  lessons.map((lesson) => localizeLesson(lesson, lang));

export const getLessonById = (lang: Language, lessonId: string): Lesson | null => {
  const lesson = lessonById.get(lessonId);
  return lesson ? localizeLesson(lesson, lang) : null;
};

export const getLessonByQuizId = (lang: Language, quizId: string): Lesson | null => {
  const meta = quizMetaById.get(quizId);
  if (!meta) return null;
  return getLessonById(lang, meta.lessonId);
};

export const getQuizOrder = (): string[] => [...quizOrder];

export const getQuizMetaById = (
  quizId: string,
): { lessonId: string; lessonIndex: number; quizIndex: number } | null =>
  quizMetaById.get(quizId) ?? null;

export const getQuizIdsByLessonId = (lessonId: string): string[] =>
  lessonById.get(lessonId)?.quizIds ?? [];