package io.limberest.demo.service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.json.JSONObject;

import io.limberest.demo.model.Movie;
import io.limberest.demo.persist.MoviesPersistFile;
import io.limberest.demo.persist.Persist;
import io.limberest.demo.persist.Persist.PersistException;
import io.limberest.json.JsonMatcher;
import io.limberest.json.JsonableComparator;
import io.limberest.service.Query;
import io.limberest.service.ServiceException;
import io.limberest.service.http.Status;

public class MoviesAccess {

    private static final Persist<Movie> persist = new MoviesPersistFile("movies.json");
    
    List<Movie> getMovies(Query query) throws PersistException {
        
        Stream<Movie> stream = getMovies().stream();
        
        // filter
        if (query.hasFilters() || query.getSearch() != null) {
            stream = stream.filter(movie -> query.match(new JsonMatcher(movie.toJson())));
        }
        
        // sort
        if ((query.getSort() != null && !"title".equals(query.getSort())) || query.isDescending()) {
            stream = stream.sorted(new JsonableComparator(query, (j1, j2) -> {
                return getSortTitle(j1).compareToIgnoreCase(getSortTitle(j2));
            }));
        }
        
        // paginate
        if (query.getStart() > 0)
            stream = stream.skip(query.getStart());
        if (query.getMax() != Query.MAX_ALL)
            stream = stream.limit(query.getMax());
        
        return stream.collect(Collectors.toList());
    }

    private static final String[] ignoredLeadingArticles = new String[]{"A ", "An ", "The "};
    private static String getSortTitle(JSONObject json) {
        String title = json.has("title") ? json.getString("title") : "";
        for (String leadingArticle : ignoredLeadingArticles) {
            if (title.startsWith(leadingArticle))
                return title.substring(leadingArticle.length());
        }
        return title;
    }

    List<Movie> retrieveMovies() throws PersistException {
        _movies = persist.retrieve();
        _movies.sort((m1, m2) -> {
            return getSortTitle(m1.toJson()).compareToIgnoreCase(getSortTitle(m2.toJson()));
        });
        return _movies;
    }
    private static List<Movie> _movies;
    private List<Movie> getMovies() throws PersistException {
        synchronized(persist) {
            if (_movies == null)
                _movies = retrieveMovies();
        }
        return _movies;
    }
    
    Movie get(String movieId) throws ServiceException, PersistException {
        for (Movie movie : getMovies()) {
            if (movie.getId().equals(movieId))
                return movie;
        }
        return null;
    }
    
    Movie create(Movie movie) throws PersistException {
        getMovies(); // avoid adding twice in case create is first request
        synchronized(persist) {
            Movie newMovie = persist.create(movie);
            getMovies().add(newMovie);
            return newMovie;
        }
    }
    
    void update(Movie movie) throws ServiceException, PersistException {
        synchronized(persist) {
            persist.update(movie);
            int idx = -1;
            for (int i = 0; i < getMovies().size(); i++) {
                if (getMovies().get(i).getId().equals(movie.getId())) {
                    idx = i;
                    break;
                }
            }
            if (idx == -1)
                throw new ServiceException(Status.NOT_FOUND, "Movie not found:" + movie.getId());
            getMovies().set(idx, movie);
        }
    }
    
    void delete(String movieId) throws ServiceException, PersistException {
        synchronized(persist) {
            Movie movie = null;
            int idx = -1;
            for (int i = 0; i < getMovies().size(); i++) {
                movie = getMovies().get(i); 
                if (movie.getId().equals(movieId)) {
                    idx = i;
                    break;
                }
            }
            if (idx == -1)
                throw new ServiceException(Status.NOT_FOUND, "Movie not found:" + movie.getId());
            
            persist.delete(movie);
            getMovies().remove(idx);
        }
    }
}
