import pandas as pd
from scipy import sparse
from scipy.spatial.distance import cosine
from scipy.stats import pearsonr
import numpy as np
from django.db.models import Q


def similarity_func(x, y):
	x = np.array(x)
	y = np.array(y)

	common = [i for i in range(len(x)) if not np.isnan(x[i]) and not np.isnan(y[i])]
	x = np.take(x, common)
	y = np.take(y, common)

	if np.all(x == x[0]) or np.all(y == y[0]):
		return 0
	return 1 - cosine(x, y)



def get_ratings_df(data):
	ratings_df = pd.DataFrame(data)
	ratings_df = pd.pivot_table(ratings_df, values='rating', index=['user'], columns=['restaurant'])

	ratings_df_mean = ratings_df.mean(axis=1)
	norm_ratings_df = ratings_df.subtract(ratings_df_mean, axis='rows')

	return ratings_df, norm_ratings_df

def get_similarity_df(norm_ratings_df):
	users_no = norm_ratings_df.shape[0]

	similarity_matrix = np.array([similarity_func(norm_ratings_df.iloc[i, :], norm_ratings_df.iloc[j, :])
		for i in range(0, users_no) for j in range(0, users_no)])
	similarity_df = pd.DataFrame(similarity_matrix.reshape(users_no, users_no))

	similarity_df = similarity_df.set_index(norm_ratings_df.index)
	similarity_df = similarity_df.set_axis(norm_ratings_df.index, axis=1)

	return similarity_df

def get_neighbours(similarity_df, user):
	similarity_vector = similarity_df.loc[user, :]
	return [i for i in similarity_vector.index if i != user and similarity_vector[i] > 0.75]

def get_predictions(ratings_df, similarity_df, user):

	user_ratings = ratings_df.loc[user]
	not_rated = [i for i in user_ratings.index if np.isnan(user_ratings[i])] 
	filled_ratings_df = ratings_df.apply(lambda row: row.fillna(row.mean()), axis=1)

	neighbours = get_neighbours(similarity_df, user)
	print(neighbours)
	neighbours_similarities = similarity_df.loc[user, neighbours]
	neighbours_ratings = filled_ratings_df.loc[neighbours, not_rated]
	
	score = np.dot(neighbours_similarities, neighbours_ratings)/np.sum(neighbours_similarities)
	return pd.Series(data=score, index=not_rated)


data = {
	'user': [1, 1, 1, 2, 2, 2, 3, 3, 3 ,4, 4, 5, 5, 5, 1, 2, 1, 2, 6, 6, 6],
	'restaurant': [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 1, 2, 3, 4, 4, 5, 5, 1, 2, 3],
	'rating': [5, 4, 3, 4, 4, 1, 1, 1, 5, 5, 1, 4, 4, 2, 4, 5, 4, 3, 4, 5, 3]
}


ratings_df, norm_ratings_df = get_ratings_df(data)
similarity_df = get_similarity_df(norm_ratings_df)
user = 5
score = get_predictions(ratings_df, similarity_df, user)


print(ratings_df)
print(similarity_df)
print(score)
