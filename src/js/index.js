import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/likes';

import { elements, renderLoader, clearloader } from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

const state = {};

const controlSearch = async () => {
	const query = searchView.getInput();
	if (query) {
		state.search = new Search(query);
		searchView.clearInput();
		searchView.clearResults();

		renderLoader(elements.searchRes);

		try {
			await state.search.getResults();
			clearloader();
			searchView.renderResults(state.search.result);
		} catch (err) {
			alert('Something wrong with the search 🚫');
			clearloader();
		}
	}
};

elements.searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	controlSearch();
});

elements.searchResPages.addEventListener('click', (e) => {
	const btn = e.target.closest('.btn-inline');
	if (btn) {
		const goToPage = parseInt(btn.dataset.goto, 10);
		searchView.clearResults();
		searchView.renderResults(state.search.result, goToPage);
	}
});

//Recipe Controller
const controlRecipe = async () => {
	const id = window.location.hash.replace('#', '');

	if (id) {
		recipeView.clearRecipe();
		renderLoader(elements.recipe);
		
		if (state.search)
		searchView.highLightSelected(id);
		

		state.recipe = new Recipe(id);
		try {
			await state.recipe.getRecipe();
			state.recipe.parseIngredients();
			state.recipe.calcTime();
			state.recipe.calcServings();

			clearloader();
			recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
		} catch (err) {
			alert('Error Processing Recipes 😥');
		}
	}
};

['hashchange', 'load'].forEach((event) => window.addEventListener(event, controlRecipe));



//List Controller

const controlList = () => {
	if(!state.list)
		state.list = new List();

	state.recipe.ingredients.forEach(el => {
		const item = state.list.addItem(el.count, el.unit, el.ingredient);
		listView.renderItem(item);
	})
	
	// listView.renderClearBtn();
	if(state.list)
		elements.clearBtn.classList.add('vis');
}


elements.shopping.addEventListener('click', e => {
	const id = e.target.closest('.shopping__item').dataset.itemid;
	
	if(e.target.matches('.shopping__delete, .shopping__delete *')) {
		state.list.deleteItem(id);
		listView.deleteItem(id);
	} else if(e.target.matches('.shopping__count-value')) {
		const val = parseFloat(e.target.value, 10);
		state.list.updateCount(id, val);
	}
})


elements.clearBtn.addEventListener('click', e => {
	state.list.deleteAll();
	listView.deleteAll();
	elements.clearBtn.classList.remove('vis');
})

// Like Controller

const controlLike = () => {

	if(!state.likes) state.likes = new Likes();
	const  currentID = state.recipe.id;

	if(!state.likes.isLiked(currentID)) {
		const newLike = state.likes.addLikes(
			currentID,
			state.recipe.title,
			state.recipe.author,
			state.recipe.img
		);

		likesView.toggleLikeBtn(true);

		likesView.renderLike(newLike);

	}else {
		state.likes.deleteLike (currentID);	
		likesView.toggleLikeBtn(false);
		likesView.deleteLike(currentID);
	}

	likesView.toggleLikeMenu(state.likes.getNumLikes()); 
};


// Restore liked RECIPES on page load 

window.addEventListener('load', e => {

	state.likes = new Likes();
	state.likes.readStorage();
	likesView.toggleLikeMenu(state.likes.getNumLikes());
	state.likes.likes.forEach(like => likesView.renderLike(like));
})


elements.recipe.addEventListener('click', (e) => {
	if (e.target.matches('.btn-decrease, .btn-decrease *')) {
		if (state.recipe.servings > 1) {	
			state.recipe.updateServings('dec');
			recipeView.updateServingValue(state.recipe);
		}
	} else if (e.target.matches('.btn-increase, .btn-increase *')) {
		state.recipe.updateServings('inc');
		recipeView.updateServingValue(state.recipe);
	} else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
		controlList(); 
	} else if (e.target.matches('.recipe__love, .recipe__love *')) {
		controlLike();
	}
});



