const pos = require('pos');//require('wordpos');
const sentencer = require('sentencer');
const clarifai = require('clarifai');
const MODEL_ID = 'b4424598a08543b181c0393e697e8fd6';
const CLIENT_ID = 'XXOigcQo38GxmHDtL9cuebNF7bMUd0lvest6UA3d';
const CLIENT_SECRET = 'siJKxg5bqy3HnddttByFCJxRkLBkbu_VyKYqVO_O';
const {GENERAL_MODEL, COLOR_MODEL} = clarifai;
const ai  = new clarifai.App(CLIENT_ID, CLIENT_SECRET);
const templates = require('./templates');
const emotion = require('./emotions');

const phraser = require('./phraser')

const processor = {
	robart: (url) => {  //obtains image categor
		return ai.models.predict(MODEL_ID, url)
			.then(response => {
				const {concepts} = response.data.outputs[0].data;
				return {category: concepts[0]};
			}, err => []);
	},
	general: (url) => {
		return ai.models
			.predict(GENERAL_MODEL, url)
			.then(response => {
				const {concepts} = response.data.outputs[0].data;
				const tags = concepts.map(x => x.name);
				tags.shift();
				return tags;
			}, err => []);
	},
	color: (url) => {
		var _ = this;
		return ai.models.predict(COLOR_MODEL, url)
			.then(response => {
				const {colors} = response.data.outputs[0].data;
				const emotions = emotion(colors.map(c => c.raw_hex));

				const expression = phraser(emotions, 'emotions')

				return {
					colors: colors.map(c => c.w3c),
					emotions,
					expression
				};
			}, err => []);
	},
	sentencer: phraser
};

module.exports = processor;