const initialState = { data: null, loading: false, error: null };

export default function NetworkReducer(TYPE: string) {
	return (state = initialState, action: any) => {
		const SUCCESS = `${TYPE}_SUCCESS`;
		const FAIL = `${TYPE}_FAIL`;
		switch (action.type) {
			case TYPE:
				return { ...state, loading: true, error: null };
			case SUCCESS:
				return {
					...state,
					loading: false,
					error: null,
					data: action.payload?.data,
				};
			case FAIL:
				return { ...state, loading: false, error: action.error };
			default:
				return state;
		}
	};
}
