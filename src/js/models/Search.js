import axios from 'axios';

export default class Search {
	constructor(query) {
		this.query = query;
		// console.log(this.query);
	}

	async getResults() {
		try {
			const res = await axios(`https://forkify-api.herokuapp.com/api/search?q=${this.query}`);
			this.result = res.data.recipes;
		} catch (err) {
			alert(err);
		}
	}
}
