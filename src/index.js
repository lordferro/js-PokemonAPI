/*
 * - Пагинация
 *   - страница и кол-во на странице
 * - Загружаем статьи при сабмите формы
 * - Загружаем статьи при нажатии на кнопку «Загрузить еще»
 * - Обновляем страницу в параметрах запроса
 * - Рисуем статьи
 * - Сброс значения при поиске по новому критерию
 *
 * https://newsapi.org/
 * 4330ebfabc654a6992c2aa792f3173a3
 * http://newsapi.org/v2/everything?q=cat&language=en&pageSize=5&page=1
 */

// 525ac24a30b345fc93a5e4d238eecf81
import articlesTpl from './templates/articles.hbs';
import './css/common.css';
// Импортируем класс
import NewsApiService from './js/news-service';
import LoadMoreBtn from './js/components/load-more-btn';

const refs = {
  searchForm: document.querySelector('.js-search-form'),
  articlesContainer: document.querySelector('.js-articles-container'),
  // loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};
// создаём экземпляр класса
const newsApiService = new NewsApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '[data-action="load-more"]', hidden: true });


refs.searchForm.addEventListener('submit', onSearch);
// вешаем слушателя
loadMoreBtn.refs.button.addEventListener('click', fetchArticles);

function onSearch(e) {
  e.preventDefault();

  // используя setter в классе, записываем поисковой запрос. 
  newsApiService.query = e.currentTarget.elements.query.value;

  loadMoreBtn.show();
  
  clearArticlesContainer();
  // сброс нумерации страниц при новом поиске
  newsApiService.resetPage();
  fetchArticles();
}

function fetchArticles() {
  loadMoreBtn.disable();
  newsApiService.fetchArticles().then(articles => {
    appendArticlesMarkup(articles);
    loadMoreBtn.enable();
  });
}

function appendArticlesMarkup(articles) {
  refs.articlesContainer.insertAdjacentHTML('beforeend', articlesTpl(articles))
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = "";
}