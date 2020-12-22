if (!('toJSON' in Error.prototype)) {
	Object.defineProperty(Error.prototype, 'toJSON', {
		value: function () {
			var alt = {} as any;

			const _this = this as any;
			Object.getOwnPropertyNames(_this).forEach(function (key) {
				alt[key] = _this[key];
			}, _this);

			return alt;
		},
		configurable: true,
		writable: true,
	});
}
