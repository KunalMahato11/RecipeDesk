import Recipe from "../models/Recipe";

export const elements = {
	searchInput: document.querySelector('.search__field'),
	searchForm: document.querySelector('.search'),
	searchResList: document.querySelector('.results__list'),
    searchRes: document.querySelector('.results'),
	searchResPages: document.querySelector('.results__pages'),
	recipe: document.querySelector('.recipe'),
	shopping: document.querySelector('.shopping__list'),
	likesMenu: document.querySelector('.likes__field'),
	likesList: document.querySelector('.likes__list'),
	clearBtn: document.querySelector('.btn-clear')
};

export const elementStrings = {
	loader: 'loader',
};

export const renderLoader = (parent) => {
	const loader = `
        <div class="${elementStrings.loader}">
             <img src="./img/loading.svg" alt="loader" class="loader" >       
        </div>
    `;
	parent.insertAdjacentHTML('afterbegin', loader);
};
  
export const clearloader = () => {
	const loader = document.querySelector(`.${elementStrings.loader}`);

	if (loader) {
		loader.parentElement.removeChild(loader);
	}
};
