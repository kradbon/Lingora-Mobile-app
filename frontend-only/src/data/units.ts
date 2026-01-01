import type { Language } from '../i18n';
import { localizeString, type LocalizedString } from '../i18n/localize';

const ls = (en: string, ru: string, tg: string): LocalizedString => ({ en, ru, tg });

export type LocalizedUnit = {
  id: string;
  title: LocalizedString;
  lessonId: string;
  quiz: { question: LocalizedString; choices: LocalizedString[]; answer: number };
};

export type Unit = {
  id: string;
  title: string;
  lessonId: string;
  quiz: { question: string; choices: string[]; answer: number };
};

type QuizSeed = {
  q: LocalizedString;
  choices: LocalizedString[];
  answer: number;
};

type QuizGroup = {
  lessonId: string;
  lessonIndex: number;
  quizzes: QuizSeed[];
};

const quizTitle = (lessonIndex: number, quizIndex: number): LocalizedString => ({
  en: `Lesson ${lessonIndex} Quiz ${quizIndex}`,
  ru: `Урок ${lessonIndex} Тест ${quizIndex}`,
  tg: `Дарс ${lessonIndex} Тест ${quizIndex}`,
});

const quizGroups: QuizGroup[] = [
  {
    lessonId: 'l01-html-intro',
    lessonIndex: 1,
    quizzes: [
      { q: ls('What does HTML stand for?', 'Что означает HTML?', 'HTML чӣ маъно дорад?'), choices: [ls('HyperText Markup Language', 'HyperText Markup Language', 'HyperText Markup Language'), ls('HighText Machine Language', 'HighText Machine Language', 'HighText Machine Language'), ls('HyperText and links Markup Language', 'HyperText and links Markup Language', 'HyperText and links Markup Language')], answer: 0 },
      { q: ls('Who makes the Web standards?', 'Кто создает веб-стандарты?', 'Кӣ стандартҳои вебро месозад?'), choices: [ls('The World Wide Web Consortium', 'The World Wide Web Consortium', 'The World Wide Web Consortium'), ls('Google', 'Google', 'Google'), ls('Microsoft', 'Microsoft', 'Microsoft')], answer: 0 },
      { q: ls('Largest heading element?', 'Самый большой заголовок?', 'Кадом унсур сарлавҳаи калонтарин аст?'), choices: [ls('<h1>', '<h1>', '<h1>'), ls('<heading>', '<heading>', '<heading>'), ls('<h6>', '<h6>', '<h6>')], answer: 0 },
      { q: ls('Tag for line break?', 'Тег для разрыва строки?', 'Тег барои гузаштан ба сатри нав?'), choices: [ls('<br>', '<br>', '<br>'), ls('<lb>', '<lb>', '<lb>'), ls('<break>', '<break>', '<break>')], answer: 0 },
      { q: ls('Background color attribute?', 'Атрибут фонового цвета?', 'Атрибути ранги замина?'), choices: [ls('style', 'style', 'style'), ls('bg', 'bg', 'bg'), ls('background', 'background', 'background')], answer: 0 },
      { q: ls('Define important text?', 'Определить важный текст?', 'Матни муҳимро муайян кунед?'), choices: [ls('<strong>', '<strong>', '<strong>'), ls('<important>', '<important>', '<important>'), ls('<b>', '<b>', '<b>')], answer: 0 },
      { q: ls('Define emphasized text?', 'Определить курсив (акцент)?', 'Матни таъкидшударо муайян кунед?'), choices: [ls('<em>', '<em>', '<em>'), ls('<i>', '<i>', '<i>'), ls('<italic>', '<italic>', '<italic>')], answer: 0 },
      { q: ls('Character for end tag?', 'Символ закрывающего тега?', 'Аломати теги пӯшанда?'), choices: [ls('/', '/', '/'), ls('*', '*', '*'), ls('<', '<', '<')], answer: 0 },
      { q: ls('Open link in new tab?', 'Открыть в новой вкладке?', 'Пайвандро дар варақаи нав кушоед?'), choices: [ls('target="_blank"', 'target="_blank"', 'target="_blank"'), ls('target="new"', 'target="new"', 'target="new"'), ls('new', 'new', 'new')], answer: 0 },
      { q: ls('Table element?', 'Элемент таблицы?', 'Унсури ҷадвал?'), choices: [ls('<table>', '<table>', '<table>'), ls('<tab>', '<tab>', '<tab>'), ls('<body>', '<body>', '<body>')], answer: 0 },
    ],
  },
  {
    lessonId: 'l02-html-structure',
    lessonIndex: 2,
    quizzes: [
      { q: ls('Paragraph tag?', 'Тег параграфа?', 'Теги параграф?'), choices: [ls('<p>', '<p>', '<p>'), ls('<para>', '<para>', '<para>'), ls('<paragraph>', '<paragraph>', '<paragraph>')], answer: 0 },
      { q: ls('Horizontal line tag?', 'Тег горизонтальной линии?', 'Теги хати уфуқӣ?'), choices: [ls('<hr>', '<hr>', '<hr>'), ls('<line>', '<line>', '<line>'), ls('<br>', '<br>', '<br>')], answer: 0 },
      { q: ls('Image alt attribute?', 'Атрибут alt у картинки?', 'Атрибути alt барои тасвир?'), choices: [ls('alternate text', 'альтернативный текст', 'матни алтернативӣ'), ls('title', 'заголовок', 'сарлавҳа'), ls('src', 'источник', 'манбаъ')], answer: 0 },
      { q: ls('Document title tag?', 'Тег заголовка документа?', 'Теги сарлавҳаи ҳуҷҷат?'), choices: [ls('<title>', '<title>', '<title>'), ls('<head>', '<head>', '<head>'), ls('<meta>', '<meta>', '<meta>')], answer: 0 },
      { q: ls('Unordered list tag?', 'Маркированный список?', 'Теги рӯйхати бетартиб?'), choices: [ls('<ul>', '<ul>', '<ul>'), ls('<ol>', '<ol>', '<ol>'), ls('<li>', '<li>', '<li>')], answer: 0 },
      { q: ls('Ordered list tag?', 'Нумерованный список?', 'Теги рӯйхати рақамӣ?'), choices: [ls('<ol>', '<ol>', '<ol>'), ls('<ul>', '<ul>', '<ul>'), ls('<li>', '<li>', '<li>')], answer: 0 },
      { q: ls('List item tag?', 'Элемент списка?', 'Теги унсури рӯйхат?'), choices: [ls('<li>', '<li>', '<li>'), ls('<item>', '<item>', '<item>'), ls('<ul>', '<ul>', '<ul>')], answer: 0 },
      { q: ls('Hyperlink tag?', 'Тег ссылки?', 'Теги пайванд?'), choices: [ls('<a>', '<a>', '<a>'), ls('<link>', '<link>', '<link>'), ls('<href>', '<href>', '<href>')], answer: 0 },
      { q: ls('Table row tag?', 'Строка таблицы?', 'Теги сатри ҷадвал?'), choices: [ls('<tr>', '<tr>', '<tr>'), ls('<td>', '<td>', '<td>'), ls('<th>', '<th>', '<th>')], answer: 0 },
      { q: ls('Table header tag?', 'Заголовок таблицы?', 'Теги сарлавҳаи ҷадвал?'), choices: [ls('<th>', '<th>', '<th>'), ls('<tr>', '<tr>', '<tr>'), ls('<td>', '<td>', '<td>')], answer: 0 },
    ],
  },
  {
    lessonId: 'l03-formatting',
    lessonIndex: 3,
    quizzes: [
      { q: ls('Bold text?', 'Жирный текст?', 'Матни ғафс?'), choices: [ls('<b>', '<b>', '<b>'), ls('<bold>', '<bold>', '<bold>'), ls('<strong>', '<strong>', '<strong>')], answer: 0 },
      { q: ls('Italic text?', 'Курсив?', 'Матни каҷ?'), choices: [ls('<i>', '<i>', '<i>'), ls('<italic>', '<italic>', '<italic>'), ls('<em>', '<em>', '<em>')], answer: 0 },
      { q: ls('Marked text?', 'Выделенный текст?', 'Матни қайдшуда?'), choices: [ls('<mark>', '<mark>', '<mark>'), ls('<high>', '<high>', '<high>'), ls('<b>', '<b>', '<b>')], answer: 0 },
      { q: ls('Small text?', 'Мелкий текст?', 'Матни хурд?'), choices: [ls('<small>', '<small>', '<small>'), ls('<tiny>', '<tiny>', '<tiny>'), ls('<sub>', '<sub>', '<sub>')], answer: 0 },
      { q: ls('Deleted text?', 'Удаленный текст?', 'Матни нестшуда?'), choices: [ls('<del>', '<del>', '<del>'), ls('<strike>', '<strike>', '<strike>'), ls('<remove>', '<remove>', '<remove>')], answer: 0 },
      { q: ls('Inserted text?', 'Вставленный текст?', 'Матни иловашуда?'), choices: [ls('<ins>', '<ins>', '<ins>'), ls('<add>', '<add>', '<add>'), ls('<new>', '<new>', '<new>')], answer: 0 },
      { q: ls('Subscript?', 'Нижний индекс?', 'Индекси поён?'), choices: [ls('<sub>', '<sub>', '<sub>'), ls('<sup>', '<sup>', '<sup>'), ls('<low>', '<low>', '<low>')], answer: 0 },
      { q: ls('Superscript?', 'Верхний индекс?', 'Индекси боло?'), choices: [ls('<sup>', '<sup>', '<sup>'), ls('<sub>', '<sub>', '<sub>'), ls('<high>', '<high>', '<high>')], answer: 0 },
      { q: ls('Quote tag?', 'Тег цитаты?', 'Теги иқтибос?'), choices: [ls('<blockquote>', '<blockquote>', '<blockquote>'), ls('<q>', '<q>', '<q>'), ls('<cite>', '<cite>', '<cite>')], answer: 0 },
      { q: ls('Work title?', 'Название работы?', 'Сарлавҳаи кор?'), choices: [ls('<cite>', '<cite>', '<cite>'), ls('<title>', '<title>', '<title>'), ls('<ref>', '<ref>', '<ref>')], answer: 0 },
    ],
  },
  {
    lessonId: 'l04-lists-links',
    lessonIndex: 4,
    quizzes: [
      { q: ls('Link destination?', 'Назначение ссылки?', 'Мақсади пайванд?'), choices: [ls('href', 'href', 'href'), ls('src', 'src', 'src'), ls('link', 'link', 'link')], answer: 0 },
      { q: ls('Email link?', 'Ссылка на почту?', 'Пайванди почта?'), choices: [ls('mailto:', 'mailto:', 'mailto:'), ls('email:', 'email:', 'email:'), ls('send:', 'send:', 'send:')], answer: 0 },
      { q: ls('Remove underline?', 'Убрать подчеркивание?', 'Хатти поёнро гиред?'), choices: [ls('text-decoration:none', 'text-decoration:none', 'text-decoration:none'), ls('border:none', 'border:none', 'border:none'), ls('text-style:none', 'text-style:none', 'text-style:none')], answer: 0 },
      { q: ls('Bullet list?', 'Список с маркерами?', 'Рӯйхати нишондор?'), choices: [ls('Unordered', 'Маркированный', 'Бетартиб'), ls('Ordered', 'Нумерованный', 'Рақамӣ'), ls('Data', 'Данные', 'Маълумот')], answer: 0 },
      { q: ls('Number list?', 'Список с цифрами?', 'Рӯйхати рақамӣ?'), choices: [ls('Ordered', 'Нумерованный', 'Рақамӣ'), ls('Unordered', 'Маркированный', 'Бетартиб'), ls('Data', 'Данные', 'Маълумот')], answer: 0 },
      { q: ls('Definition list?', 'Список определений?', 'Рӯйхати таърифҳо?'), choices: [ls('<dl>', '<dl>', '<dl>'), ls('<ul>', '<ul>', '<ul>'), ls('<ol>', '<ol>', '<ol>')], answer: 0 },
      { q: ls('Term tag?', 'Тег термина?', 'Теги истилоҳ?'), choices: [ls('<dt>', '<dt>', '<dt>'), ls('<dd>', '<dd>', '<dd>'), ls('<dl>', '<dl>', '<dl>')], answer: 0 },
      { q: ls('Description tag?', 'Тег описания?', 'Теги тавсиф?'), choices: [ls('<dd>', '<dd>', '<dd>'), ls('<dt>', '<dt>', '<dt>'), ls('<dl>', '<dl>', '<dl>')], answer: 0 },
      { q: ls('Nest lists?', 'Вложенные списки?', 'Рӯйхатҳои дохилӣ?'), choices: [ls('Yes', 'Да', 'Ҳа'), ls('No', 'Нет', 'Не'), ls('Maybe', 'Возможно', 'Шояд')], answer: 0 },
      { q: ls('Link tag?', 'Тег ссылки?', 'Теги пайванд?'), choices: [ls('<a>', '<a>', '<a>'), ls('<link>', '<link>', '<link>'), ls('<href>', '<href>', '<href>')], answer: 0 },
    ],
  },
  {
    lessonId: 'l05-media',
    lessonIndex: 5,
    quizzes: [
      { q: ls('Image tag?', 'Тег картинки?', 'Теги тасвир?'), choices: [ls('<img>', '<img>', '<img>'), ls('<image>', '<image>', '<image>'), ls('<pic>', '<pic>', '<pic>')], answer: 0 },
      { q: ls('Source attribute?', 'Атрибут источника?', 'Атрибути манбаъ?'), choices: [ls('src', 'src', 'src'), ls('href', 'href', 'href'), ls('url', 'url', 'url')], answer: 0 },
      { q: ls('Self closing?', 'Самозакрывающийся?', 'Худпӯшанда?'), choices: [ls('Yes', 'Да', 'Ҳа'), ls('No', 'Нет', 'Не'), ls('Sometimes', 'Иногда', 'Баъзан')], answer: 0 },
      { q: ls('Missing text?', 'Текст при ошибке?', 'Матни хато?'), choices: [ls('alt', 'alt', 'alt'), ls('title', 'title', 'title'), ls('desc', 'desc', 'desc')], answer: 0 },
      { q: ls('Video tag?', 'Тег видео?', 'Теги видео?'), choices: [ls('<video>', '<video>', '<video>'), ls('<movie>', '<movie>', '<movie>'), ls('<play>', '<play>', '<play>')], answer: 0 },
      { q: ls('Audio tag?', 'Тег аудио?', 'Теги аудио?'), choices: [ls('<audio>', '<audio>', '<audio>'), ls('<sound>', '<sound>', '<sound>'), ls('<music>', '<music>', '<music>')], answer: 0 },
      { q: ls('Controls?', 'Кнопки управления?', 'Идоракунӣ?'), choices: [ls('controls', 'controls', 'controls'), ls('play', 'play', 'play'), ls('buttons', 'buttons', 'buttons')], answer: 0 },
      { q: ls('Figure wrap?', 'Обертка рисунка?', 'Печонидани тасвир?'), choices: [ls('<figure>', '<figure>', '<figure>'), ls('<div>', '<div>', '<div>'), ls('<span>', '<span>', '<span>')], answer: 0 },
      { q: ls('Fig caption?', 'Подпись рисунка?', 'Сарлавҳаи тасвир?'), choices: [ls('<figcaption>', '<figcaption>', '<figcaption>'), ls('<caption>', '<caption>', '<caption>'), ls('<title>', '<title>', '<title>')], answer: 0 },
      { q: ls('Vector format?', 'Векторный формат?', 'Формати векторӣ?'), choices: [ls('SVG', 'SVG', 'SVG'), ls('JPG', 'JPG', 'JPG'), ls('PNG', 'PNG', 'PNG')], answer: 0 },
    ],
  },
  {
    lessonId: 'l06-css-intro',
    lessonIndex: 6,
    quizzes: [
      { q: ls('CSS stands for?', 'Что такое CSS?', 'CSS чӣ маъно дорад?'), choices: [ls('Cascading Style Sheets', 'Cascading Style Sheets', 'Cascading Style Sheets'), ls('Creative Style Sheets', 'Creative Style Sheets', 'Creative Style Sheets'), ls('Colorful Style Sheets', 'Colorful Style Sheets', 'Colorful Style Sheets')], answer: 0 },
      { q: ls('External CSS location?', 'Где внешние стили?', 'Ҷойгиршавии CSS-и берунӣ?'), choices: [ls('<head>', '<head>', '<head>'), ls('<body>', '<body>', '<body>'), ls('Footer', 'Футер', 'Поёни саҳифа')], answer: 0 },
      { q: ls('Internal CSS tag?', 'Тег внутренних стилей?', 'Теги CSS-и дохилӣ?'), choices: [ls('<style>', '<style>', '<style>'), ls('<css>', '<css>', '<css>'), ls('<link>', '<link>', '<link>')], answer: 0 },
      { q: ls('Inline CSS attribute?', 'Атрибут для инлайн стилей?', 'Атрибути CSS-и дохилӣ?'), choices: [ls('style', 'style', 'style'), ls('class', 'class', 'class'), ls('id', 'id', 'id')], answer: 0 },
      { q: ls('Correct syntax?', 'Верный синтаксис?', 'Синтаксиси дуруст?'), choices: [ls('body {color: black;}', 'body {color: black;}', 'body {color: black;}'), ls('{body;color:black;}', '{body;color:black;}', '{body;color:black;}'), ls('body:color=black;', 'body:color=black;', 'body:color=black;')], answer: 0 },
      { q: ls('CSS comment?', 'Комментарий в CSS?', 'Шарҳ дар CSS?'), choices: [ls('/* ... */', '/* ... */', '/* ... */'), ls('// ...', '// ...', '// ...'), ls('# ...', '# ...', '# ...')], answer: 0 },
      { q: ls('Background color?', 'Цвет фона?', 'Ранги замина?'), choices: [ls('background-color', 'background-color', 'background-color'), ls('bgcolor', 'bgcolor', 'bgcolor'), ls('color', 'color', 'color')], answer: 0 },
      { q: ls('Text color?', 'Цвет текста?', 'Ранги матн?'), choices: [ls('color', 'color', 'color'), ls('text-color', 'text-color', 'text-color'), ls('font-color', 'font-color', 'font-color')], answer: 0 },
      { q: ls('Text size?', 'Размер текста?', 'Андозаи матн?'), choices: [ls('font-size', 'font-size', 'font-size'), ls('text-size', 'text-size', 'text-size'), ls('style-size', 'style-size', 'style-size')], answer: 0 },
      { q: ls('Text alignment?', 'Выравнивание текста?', 'Росткунии матн?'), choices: [ls('text-align', 'text-align', 'text-align'), ls('align', 'align', 'align'), ls('pos-align', 'pos-align', 'pos-align')], answer: 0 },
    ],
  },
  {
    lessonId: 'l07-selectors',
    lessonIndex: 7,
    quizzes: [
      { q: ls('ID selector?', 'Селектор ID?', 'Селектори ID?'), choices: [ls('#demo', '#demo', '#demo'), ls('.demo', '.demo', '.demo'), ls('demo', 'demo', 'demo')], answer: 0 },
      { q: ls('Class selector?', 'Селектор класса?', 'Селектори класс?'), choices: [ls('.test', '.test', '.test'), ls('#test', '#test', '#test'), ls('test', 'test', 'test')], answer: 0 },
      { q: ls('All elements?', 'Все элементы?', 'Ҳама унсурҳо?'), choices: [ls('*', '*', '*'), ls('.', '.', '.'), ls('all', 'all', 'all')], answer: 0 },
      { q: ls('Direct child?', 'Прямой потомок?', 'Фарзанди мустақим?'), choices: [ls('>', '>', '>'), ls('+', '+', '+'), ls('~', '~', '~')], answer: 0 },
      { q: ls('Adjacent sibling?', 'Соседний элемент?', 'Ҳамсояи наздик?'), choices: [ls('+', '+', '+'), ls('~', '~', '~'), ls('>', '>', '>')], answer: 0 },
      { q: ls('Hover state?', 'Наведение мыши?', 'Ҳолати hover?'), choices: [ls(':hover', ':hover', ':hover'), ls(':focus', ':hover', ':hover'), ls(':active', ':hover', ':hover')], answer: 0 },
      { q: ls('First child?', 'Первый потомок?', 'Фарзанди аввал?'), choices: [ls(':first-child', ':first-child', ':first-child'), ls(':one', ':one', ':one'), ls(':first', ':first', ':first')], answer: 0 },
      { q: ls('Last child?', 'Последний потомок?', 'Фарзанди охирин?'), choices: [ls(':last-child', ':last-child', ':last-child'), ls(':end', ':end', ':end'), ls(':final', ':final', ':final')], answer: 0 },
      { q: ls('Active link?', 'Активная ссылка?', 'Пайванди фаъол?'), choices: [ls(':active', ':active', ':active'), ls(':link', ':link', ':link'), ls(':visited', ':visited', ':visited')], answer: 0 },
      { q: ls('Multiple classes?', 'Несколько классов?', 'Чанд класс?'), choices: [ls('.a.b', '.a.b', '.a.b'), ls('.a .b', '.a .b', '.a .b'), ls('.a, .b', '.a, .b', '.a, .b')], answer: 0 },
    ],
  },
  {
    lessonId: 'l08-box-model',
    lessonIndex: 8,
    quizzes: [
      { q: ls('Inside space?', 'Внутренний отступ?', 'Фосилаи дохилӣ?'), choices: [ls('padding', 'padding', 'padding'), ls('margin', 'margin', 'margin'), ls('border', 'border', 'border')], answer: 0 },
      { q: ls('Outside space?', 'Внешний отступ?', 'Фосилаи берунӣ?'), choices: [ls('margin', 'margin', 'margin'), ls('padding', 'padding', 'padding'), ls('border', 'border', 'border')], answer: 0 },
      { q: ls('Box components?', 'Состав бокса?', 'Қисмҳои бокс?'), choices: [ls('Margin, Border, Padding, Content', 'Margin, Border, Padding, Content', 'Margin, Border, Padding, Content'), ls('Width, Height', 'Width, Height', 'Width, Height'), ls('HTML, CSS', 'HTML, CSS', 'HTML, CSS')], answer: 0 },
      { q: ls('Width property?', 'Свойство ширины?', 'Хосияти васеъгӣ?'), choices: [ls('width', 'width', 'width'), ls('size', 'size', 'size'), ls('wt', 'wt', 'wt')], answer: 0 },
      { q: ls('Border box?', 'Border box?', 'Border box?'), choices: [ls('Includes padding', 'Включает отступы', 'Фосиларо дар бар мегирад'), ls('Excludes padding', 'Исключает отступы', 'Фосиларо дар бар намегирад'), ls('No border', 'Без границ', 'Бе сарҳад')], answer: 0 },
      { q: ls('Center block?', 'Центрирование?', 'Марказонидани блок?'), choices: [ls('margin: 0 auto', 'margin: 0 auto', 'margin: 0 auto'), ls('align: center', 'align: center', 'align: center'), ls('float: center', 'float: center', 'float: center')], answer: 0 },
      { q: ls('Display block?', 'Блочный элемент?', 'Элементи блокӣ?'), choices: [ls('display: block', 'display: block', 'display: block'), ls('display: inline', 'display: inline', 'display: inline'), ls('display: none', 'display: none', 'display: none')], answer: 0 },
      { q: ls('Hide element?', 'Скрыть элемент?', 'Пинҳон кардани унсур?'), choices: [ls('display: none', 'display: none', 'display: none'), ls('display: hide', 'display: hide', 'display: hide'), ls('visibility: off', 'visibility: off', 'visibility: off')], answer: 0 },
      { q: ls('Border line?', 'Линия границы?', 'Хати сарҳад?'), choices: [ls('border', 'border', 'border'), ls('outline', 'outline', 'outline'), ls('line', 'line', 'line')], answer: 0 },
      { q: ls('Default width?', 'Ширина по умолчанию?', 'Васеъгии пешфарз?'), choices: [ls('auto', 'auto', 'auto'), ls('100%', '100%', '100%'), ls('0', '0', '0')], answer: 0 },
    ],
  },
  {
    lessonId: 'l09-fonts',
    lessonIndex: 9,
    quizzes: [
      { q: ls('Font family?', 'Семейство шрифтов?', 'Оилаи шрифтҳо?'), choices: [ls('font-family', 'font-family', 'font-family'), ls('font-type', 'font-type', 'font-type'), ls('font-style', 'font-style', 'font-style')], answer: 0 },
      { q: ls('Bold text?', 'Жирность?', 'Ғафсии матн?'), choices: [ls('font-weight', 'font-weight', 'font-weight'), ls('font-bold', 'font-bold', 'font-bold'), ls('text-bold', 'text-bold', 'text-bold')], answer: 0 },
      { q: ls('Italic text?', 'Курсив?', 'Матни каҷ?'), choices: [ls('font-style', 'font-style', 'font-style'), ls('font-weight', 'font-weight', 'font-weight'), ls('text-style', 'text-style', 'text-style')], answer: 0 },
      { q: ls('Uppercase?', 'Верхний регистр?', 'Ҳарфҳои калон?'), choices: [ls('text-transform', 'text-transform', 'text-transform'), ls('text-style', 'text-style', 'text-style'), ls('font-case', 'font-case', 'font-case')], answer: 0 },
      { q: ls('Underline remove?', 'Убрать черту?', 'Хатти поёнро гиред?'), choices: [ls('text-decoration: none', 'text-decoration: none', 'text-decoration: none'), ls('text-line: none', 'text-line: none', 'text-line: none'), ls('font-decoration: none', 'font-decoration: none', 'font-decoration: none')], answer: 0 },
      { q: ls('Relative unit?', 'Относительный юнит?', 'Воҳиди нисбӣ?'), choices: [ls('rem', 'rem', 'rem'), ls('px', 'px', 'px'), ls('pt', 'pt', 'pt')], answer: 0 },
      { q: ls('Line height?', 'Межстрочный интервал?', 'Баландии сатр?'), choices: [ls('line-height', 'line-height', 'line-height'), ls('text-height', 'text-height', 'text-height'), ls('spacing', 'spacing', 'spacing')], answer: 0 },
      { q: ls('Letter spacing?', 'Интервал букв?', 'Фосилаи ҳарфҳо?'), choices: [ls('letter-spacing', 'letter-spacing', 'letter-spacing'), ls('word-spacing', 'word-spacing', 'word-spacing'), ls('font-spacing', 'font-spacing', 'font-spacing')], answer: 0 },
      { q: ls('Generic font?', 'Общий шрифт?', 'Шрифти умумӣ?'), choices: [ls('sans-serif', 'sans-serif', 'sans-serif'), ls('arial', 'arial', 'arial'), ls('custom', 'custom', 'custom')], answer: 0 },
      { q: ls('Color property?', 'Свойство цвета?', 'Хосияти ранг?'), choices: [ls('color', 'color', 'color'), ls('text-color', 'text-color', 'text-color'), ls('font-color', 'font-color', 'font-color')], answer: 0 },
    ],
  },
  {
    lessonId: 'l10-flexbox',
    lessonIndex: 10,
    quizzes: [
      { q: ls('Enable flex?', 'Включить flex?', 'Фаъол кардани flex?'), choices: [ls('display: flex', 'display: flex', 'display: flex'), ls('display: block', 'display: block', 'display: block'), ls('display: grid', 'display: grid', 'display: grid')], answer: 0 },
      { q: ls('Main axis align?', 'Горизонталь?', 'Росткунии меҳвари асосӣ?'), choices: [ls('justify-content', 'justify-content', 'justify-content'), ls('align-items', 'align-items', 'align-items'), ls('align-content', 'align-content', 'align-content')], answer: 0 },
      { q: ls('Cross axis align?', 'Вертикаль?', 'Росткунии меҳвари фаръӣ?'), choices: [ls('align-items', 'align-items', 'align-items'), ls('justify-content', 'justify-content', 'justify-content'), ls('vertical-align', 'vertical-align', 'vertical-align')], answer: 0 },
      { q: ls('Direction?', 'Направление?', 'Самт?'), choices: [ls('flex-direction', 'flex-direction', 'flex-direction'), ls('flex-flow', 'flex-flow', 'flex-flow'), ls('direction', 'direction', 'direction')], answer: 0 },
      { q: ls('Flex wrap?', 'Перенос строк?', 'Печонидани flex?'), choices: [ls('flex-wrap', 'flex-wrap', 'flex-wrap'), ls('flex-flow', 'flex-flow', 'flex-flow'), ls('wrap', 'wrap', 'wrap')], answer: 0 },
      { q: ls('Center both?', 'Центр по обоим осям?', 'Марказонии комил?'), choices: [ls('justify and align center', 'justify and align center', 'justify and align center'), ls('text-align center', 'text-align center', 'text-align center'), ls('margin auto', 'margin auto', 'margin auto')], answer: 0 },
      { q: ls('Flex grow?', 'Растяжение?', 'Калоншавии flex?'), choices: [ls('flex-grow', 'flex-grow', 'flex-grow'), ls('flex-shrink', 'flex-grow', 'flex-grow'), ls('flex-basis', 'flex-grow', 'flex-grow')], answer: 0 },
      { q: ls('Flex order?', 'Порядок?', 'Тартиби flex?'), choices: [ls('order', 'order', 'order'), ls('rank', 'rank', 'rank'), ls('sort', 'sort', 'sort')], answer: 0 },
      { q: ls('Default direction?', 'Самт бо пешфарз?', 'Самт бо пешфарз?'), choices: [ls('row', 'row', 'row'), ls('column', 'column', 'column'), ls('none', 'none', 'none')], answer: 0 },
      { q: ls('Gap between?', 'Интервал?', 'Фосилаи байни?'), choices: [ls('gap', 'gap', 'gap'), ls('spacing', 'spacing', 'spacing'), ls('margin', 'margin', 'margin')], answer: 0 },
    ],
  },
  {
    lessonId: 'l11-grid',
    lessonIndex: 11,
    quizzes: [
      { q: ls('Enable grid?', 'Включить grid?', 'Фаъол кардани grid?'), choices: [ls('display: grid', 'display: grid', 'display: grid'), ls('display: flex', 'display: flex', 'display: flex'), ls('display: table', 'display: table', 'display: table')], answer: 0 },
      { q: ls('Column tracks?', 'Колонки?', 'Сутунҳои grid?'), choices: [ls('grid-template-columns', 'grid-template-columns', 'grid-template-columns'), ls('grid-columns', 'grid-columns', 'grid-columns'), ls('columns', 'columns', 'columns')], answer: 0 },
      { q: ls('Grid unit?', 'Юнит сетки?', 'Воҳиди grid?'), choices: [ls('fr', 'fr', 'fr'), ls('px', 'px', 'px'), ls('%', '%', '%')], answer: 0 },
      { q: ls('Grid gap?', 'Интервал сетки?', 'Фосилаи grid?'), choices: [ls('gap', 'gap', 'gap'), ls('spacing', 'spacing', 'spacing'), ls('grid-gap', 'grid-gap', 'grid-gap')], answer: 0 },
      { q: ls('Area names?', 'Имена областей?', 'Номҳои минтақаҳо?'), choices: [ls('grid-template-areas', 'grid-template-areas', 'grid-template-areas'), ls('grid-areas', 'grid-areas', 'grid-areas'), ls('areas', 'areas', 'areas')], answer: 0 },
      { q: ls('Align inside cell?', 'Выравнивание в ячейке?', 'Росткунӣ дар чашмак?'), choices: [ls('align-items', 'align-items', 'align-items'), ls('justify-items', 'align-items', 'align-items'), ls('Both', 'Оба', 'Ҳарду')], answer: 2 },
      { q: ls('Span columns?', 'Объединение колонок?', 'Пайвасти сутунҳо?'), choices: [ls('grid-column: span 2', 'grid-column: span 2', 'grid-column: span 2'), ls('colspan: 2', 'grid-column: span 2', 'grid-column: span 2'), ls('merge: 2', 'grid-column: span 2', 'grid-column: span 2')], answer: 0 },
      { q: ls('Row tracks?', 'Строки?', 'Сатрҳои grid?'), choices: [ls('grid-template-rows', 'grid-template-rows', 'grid-template-rows'), ls('grid-rows', 'grid-rows', 'grid-rows'), ls('rows', 'rows', 'rows')], answer: 0 },
      { q: ls('Nested grids?', 'Вложенные сетки?', 'Сеткаҳои дохилӣ?'), choices: [ls('Yes', 'Да', 'Ҳа'), ls('No', 'Нет', 'Не'), ls('Only 1', 'Только 1', 'Танҳо якто')], answer: 0 },
      { q: ls('Grid shorthand?', 'Сокращение?', 'Шакли кӯтоҳи grid?'), choices: [ls('grid', 'grid', 'grid'), ls('gt', 'grid', 'grid'), ls('layout', 'grid', 'grid')], answer: 0 },
    ],
  },
  {
    lessonId: 'l12-responsive',
    lessonIndex: 12,
    quizzes: [
      { q: ls('RWD stands for?', 'Что такое RWD?', 'RWD чӣ маъно дорад?'), choices: [ls('Responsive Web Design', 'Responsive Web Design', 'Responsive Web Design'), ls('Rapid Web Development', 'Rapid Web Development', 'Rapid Web Development'), ls('Real Web Design', 'Real Web Design', 'Real Web Design')], answer: 0 },
      { q: ls('Viewport meta?', 'Meta viewport?', 'Meta viewport?'), choices: [ls('Essential', 'Обязательно', 'Ҳатмӣ'), ls('Optional', 'Опционально', 'Ихтиёрӣ'), ls('Useless', 'Бесполезно', 'Бефоида')], answer: 0 },
      { q: ls('Media Query tag?', 'Тег медиа-запроса?', 'Теги дархости медиа?'), choices: [ls('@media', '@media', '@media'), ls('@query', '@query', '@query'), ls('@responsive', '@responsive', '@responsive')], answer: 0 },
      { q: ls('Max width 600px?', 'Макс ширина 600?', 'Васеъгии макс 600?'), choices: [ls('(max-width: 600px)', '(max-width: 600px)', '(max-width: 600px)'), ls('(width < 600)', '(max-width: 600px)', '(max-width: 600px)'), ls('600px', 'max-600', 'max-600')], answer: 0 },
      { q: ls('Viewport unit?', 'Юнит вьюпорта?', 'Воҳиди viewport?'), choices: [ls('vw', 'vw', 'vw'), ls('vh', 'vh', 'vh'), ls('Both', 'Оба', 'Ҳарду')], answer: 2 },
      { q: ls('Mobile-first?', 'Сначала мобильные?', 'Аввал мобилӣ?'), choices: [ls('True', 'Верно', 'Дуруст'), ls('False', 'Неверно', 'Нодуруст'), ls('Optional', 'Не обязательно', 'Ихтиёрӣ')], answer: 0 },
      { q: ls('Hide on small?', 'Скрыть на малых?', 'Пинҳон кардан дар хурд?'), choices: [ls('display: none', 'display: none', 'display: none'), ls('opacity: 0', 'display: none', 'display: none'), ls('width: 0', 'display: none', 'display: none')], answer: 0 },
      { q: ls('Responsive image?', 'Адаптивная картинка?', 'Тасвири адаптивӣ?'), choices: [ls('max-width: 100%', 'max-width: 100%', 'max-width: 100%'), ls('width: 100px', 'max-width: 100%', 'max-width: 100%'), ls('height: auto', 'height: auto', 'height: auto')], answer: 0 },
      { q: ls('Breakpoints?', 'Брейкпоинты?', 'Нуқтаҳои гузариш?'), choices: [ls('Layout changes', 'Макет меняется', 'Тағйири макет'), ls('Code breaks', 'Код ломается', 'Хатои код'), ls('Page stops', 'Пауза', 'Ист')], answer: 0 },
      { q: ls('Percentage width?', 'Ширина в %?', 'Васеъгӣ бо %?'), choices: [ls('Recommended', 'Рекомендуется', 'Тавсия мешавад'), ls('Forbidden', 'Запрещено', 'Манъ аст'), ls('Useless', 'Бесполезно', 'Бефоида')], answer: 0 },
    ],
  },
  {
    lessonId: 'l13-input-forms',
    lessonIndex: 13,
    quizzes: [
      { q: ls('Select tag?', 'Тег выбора?', 'Теги интихоб?'), choices: [ls('<select>', '<select>', '<select>'), ls('<list>', '<list>', '<list>'), ls('<dropdown>', '<dropdown>', '<dropdown>')], answer: 0 },
      { q: ls('Option tag?', 'Тег опции?', 'Теги вариант?'), choices: [ls('<option>', '<option>', '<option>'), ls('<item>', '<item>', '<item>'), ls('<choice>', '<choice>', '<choice>')], answer: 0 },
      { q: ls('Multi-line text?', 'Многострочный текст?', 'Матни бисёрсатра?'), choices: [ls('<textarea>', '<textarea>', '<textarea>'), ls('<input type="text">', '<input type="text">', '<input type="text">'), ls('<text>', '<text>', '<text>')], answer: 0 },
      { q: ls('Clickable button?', 'Кнопка?', 'Тугма?'), choices: [ls('<button>', '<button>', '<button>'), ls('<input type="button">', '<input type="button">', '<input type="button">'), ls('Both', 'Оба', 'Ҳарду')], answer: 2 },
      { q: ls('Group elements?', 'Группировка?', 'Гурӯҳбандӣ?'), choices: [ls('<fieldset>', '<fieldset>', '<fieldset>'), ls('<group>', '<group>', '<group>'), ls('<section>', '<section>', '<section>')], answer: 0 },
      { q: ls('Group caption?', 'Подпись группы?', 'Сарлавҳаи гурӯҳ?'), choices: [ls('<legend>', '<legend>', '<legend>'), ls('<caption>', '<caption>', '<caption>'), ls('<title>', '<title>', '<title>')], answer: 0 },
      { q: ls('Password type?', 'Тип пароля?', 'Намуди парол?'), choices: [ls('password', 'password', 'password'), ls('hidden', 'hidden', 'hidden'), ls('secure', 'secure', 'secure')], answer: 0 },
      { q: ls('Single choice?', 'Одиночный выбор?', 'Интихоби ягона?'), choices: [ls('radio', 'radio', 'radio'), ls('checkbox', 'checkbox', 'checkbox'), ls('text', 'text', 'text')], answer: 0 },
      { q: ls('Multiple choice?', 'Множественный выбор?', 'Интихоби чандкарата?'), choices: [ls('checkbox', 'checkbox', 'checkbox'), ls('radio', 'checkbox', 'checkbox'), ls('select', 'checkbox', 'checkbox')], answer: 0 },
      { q: ls('Required field?', 'Обязательное поле?', 'Майдони ҳатмӣ?'), choices: [ls('required', 'required', 'required'), ls('must', 'must', 'must'), ls('validate', 'validate', 'validate')], answer: 0 },
    ],
  },
  {
    lessonId: 'l14-semantic',
    lessonIndex: 14,
    quizzes: [
      { q: ls('Semantic HTML?', 'Семантика?', 'HTML-и семантикӣ?'), choices: [ls('Tags with meaning', 'Теги со смыслом', 'Тегҳо бо маъно'), ls('Tags for style', 'Теги для стиля', 'Тегҳо барои услуб'), ls('Error tags', 'Теги ошибок', 'Тегҳои хато')], answer: 0 },
      { q: ls('Header tag?', 'Тег хедера?', 'Теги header?'), choices: [ls('<header>', '<header>', '<header>'), ls('<top>', '<top>', '<top>'), ls('<head>', '<head>', '<head>')], answer: 0 },
      { q: ls('Main content?', 'Главный контент?', 'Мӯҳтавои асосӣ?'), choices: [ls('<main>', '<main>', '<main>'), ls('<body>', '<body>', '<body>'), ls('<section>', '<section>', '<section>')], answer: 0 },
      { q: ls('Footer tag?', 'Тег футера?', 'Теги footer?'), choices: [ls('<footer>', '<footer>', '<footer>'), ls('<bottom>', '<bottom>', '<bottom>'), ls('<end>', '<end>', '<end>')], answer: 0 },
      { q: ls('Nav links?', 'Навигация?', 'Пайвандҳои паймоиш?'), choices: [ls('<nav>', '<nav>', '<nav>'), ls('<links>', '<links>', '<links>'), ls('<menu>', '<menu>', '<menu>')], answer: 0 },
      { q: ls('Article tag?', 'Тег статьи?', 'Теги мақола?'), choices: [ls('<article>', '<article>', '<article>'), ls('<section>', '<section>', '<section>'), ls('<div>', '<div>', '<div>')], answer: 0 },
      { q: ls('Aside content?', 'Боковой контент?', 'Мӯҳтавои иловагӣ?'), choices: [ls('<aside>', '<aside>', '<aside>'), ls('<sidebar>', '<sidebar>', '<sidebar>'), ls('<next>', '<next>', '<next>')], answer: 0 },
      { q: ls('Section tag?', 'Тег секции?', 'Теги қисм?'), choices: [ls('<section>', '<section>', '<section>'), ls('<div>', '<div>', '<div>'), ls('<part>', '<part>', '<part>')], answer: 0 },
      { q: ls('Benefit?', 'Польза?', 'Фоида?'), choices: [ls('SEO and Access', 'SEO и доступность', 'SEO ва дастрасӣ'), ls('Colors', 'Цвета', 'Рангҳо'), ls('Less code', 'Меньше кода', 'Коди камтар')], answer: 0 },
      { q: ls('Is div semantic?', 'div семантичен?', 'Оё div семантикӣ аст?'), choices: [ls('No', 'Нет', 'Не'), ls('Yes', 'Да', 'Ҳа'), ls('Maybe', 'Возможно', 'Шояд')], answer: 0 },
    ],
  },
];

export const units: LocalizedUnit[] = quizGroups.flatMap((group) =>
  group.quizzes.map((quiz, idx) => ({
    id: `${group.lessonId}-q${String(idx + 1).padStart(2, '0')}`,
    title: quizTitle(group.lessonIndex, idx + 1),
    lessonId: group.lessonId,
    quiz: {
      question: quiz.q,
      choices: quiz.choices,
      answer: quiz.answer,
    },
  })),
);

const unitById = new Map(units.map((unit) => [unit.id, unit]));

export const localizeUnit = (unit: LocalizedUnit, lang: Language): Unit => ({
  id: unit.id,
  title: localizeString(unit.title, lang),
  lessonId: unit.lessonId,
  quiz: {
    question: localizeString(unit.quiz.question, lang),
    choices: unit.quiz.choices.map((choice) => localizeString(choice, lang)),
    answer: unit.quiz.answer,
  },
});

export const getUnits = (lang: Language): Unit[] => units.map((unit) => localizeUnit(unit, lang));

export const getUnitById = (lang: Language, unitId: string): Unit | null => {
  const unit = unitById.get(unitId);
  return unit ? localizeUnit(unit, lang) : null;
};