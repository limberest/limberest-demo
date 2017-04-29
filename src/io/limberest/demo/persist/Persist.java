package io.limberest.demo.persist;

import java.util.List;

public interface Persist<T> {

    List<T> retrieve() throws PersistException;
    T create(T item) throws PersistException;
    void update(T item) throws PersistException;
    void delete(T item) throws PersistException;
    
    public class PersistException extends Exception {

        public PersistException(String message) {
            super(message);
        }
        
        public PersistException(String message, Throwable cause) {
            super(message, cause);
        }
    }    
}
