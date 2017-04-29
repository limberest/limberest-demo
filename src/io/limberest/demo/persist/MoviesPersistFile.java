package io.limberest.demo.persist;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

import org.json.JSONObject;

import io.limberest.demo.model.Movie;
import io.limberest.json.JsonList;
import io.limberest.json.JsonObject;
import io.limberest.util.FileLoader;

public class MoviesPersistFile implements Persist<Movie> {

    private String path;
    
    public MoviesPersistFile(String path) {
        this.path = path;
    }
    
    @Override
    public List<Movie> retrieve() throws PersistException {
        try {
            String json;
            File file = new File(path);
            if (file.isFile()) {
                json = new String(Files.readAllBytes(Paths.get(file.getPath())));
            }
            else {
                json = new String(new FileLoader(path).readFromClassLoader());
            }
            
            // use Limberest's JsonObject for sorted keys
            JSONObject jsonObj = new JsonObject(json);
            JsonList<Movie> jsonList = new JsonList<Movie>(jsonObj, Movie.class);
            return jsonList.getList();
        }
        catch (IOException ex) {
            throw new PersistException(ex.getMessage(), ex);
        }
    }
    
    @Override
    public synchronized Movie create(Movie movie) throws PersistException {
        List<Movie> movies = retrieve();
        String id = generateId(movie);
        for (Movie m : movies) {
            if (m.getId().equals(id)) {
                throw new PersistException("Movie already exists with id: " +id);
            }
        }
        Movie newMovie = new Movie(id, movie);
        movies.add(newMovie);
        save(movies);
        return newMovie;
    }

    @Override
    public synchronized void update(Movie movie) throws PersistException {
        List<Movie> movies = retrieve();
        Movie toReplace = null;
        for (Movie m : movies) {
            if (m.getId().equals(movie.getId())) {
                toReplace = m;
                break;
            }
        }
        if (toReplace == null)
            throw new PersistException("Movie not found with id: " + movie.getId());
        movies.remove(toReplace);
        movies.add(movie);
        save(movies);
    }


    @Override
    public synchronized void delete(Movie movie) throws PersistException {
        List<Movie> movies = retrieve();
        int idx = -1;
        for (int i = 0; i < movies.size(); i++) {
            if (movie.getId().equals(movies.get(i).getId())) {
                idx = i;
                break;
            }
        }
        if (idx == -1)
            throw new PersistException("Movie not found with id: " + movie.getId());
        movies.remove(idx);
        save(movies);
    }
    
    private void save(List<Movie> movies) throws PersistException {
        JsonList<Movie> movieList = new JsonList<>(movies, "movies");
        try {
            File file = new File(path).getAbsoluteFile();
            File parent = file.getParentFile();
            if (parent != null && !parent.exists() && !file.getParentFile().mkdirs())
                    throw new IOException("Unable to create directories: " + file.getParentFile().getAbsolutePath());
            Files.write(Paths.get(file.getPath()), movieList.toJson().toString(2).getBytes());
        }
        catch (IOException ex) {
            throw new PersistException(ex.getMessage(), ex);
        }
    }
    
    private String generateId(Movie movie) {
        return Integer.toHexString(movie.toJson().toString().hashCode());
    }
}
