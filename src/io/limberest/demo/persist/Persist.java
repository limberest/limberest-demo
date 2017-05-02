package io.limberest.demo.persist;

import java.util.List;

import io.limberest.service.Query;

public interface Persist<T> {

    List<T> retrieve(Query query) throws PersistException;
    T get(String id) throws PersistException;
    T create(T item) throws PersistException;
    void update(T item) throws PersistException;
    void delete(String id) throws PersistException;
    Class<T> getType();
    
    public class PersistException extends Exception {

        public PersistException(String message) {
            super(message);
        }
        
        public PersistException(String message, Throwable cause) {
            super(message, cause);
        }
    }    
}
