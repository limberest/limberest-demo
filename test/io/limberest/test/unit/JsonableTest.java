package io.limberest.test.unit;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

import java.util.ArrayList;
import java.util.List;

import org.json.JSONObject;
import org.junit.Test;

import io.limberest.demo.model.Credit;
import io.limberest.demo.model.Movie;
import io.limberest.demo.model.WebRef;
import io.limberest.json.JsonObject;

public class JsonableTest {
    private static final String JSON = "{\n" + 
        "  \"credits\": [\n" + 
        "    {\n" + 
        "      \"name\": \"Bela Lugosi\",\n" + 
        "      \"role\": \"Dracula\"\n" + 
        "    },\n" + 
        "    {\n" + 
        "      \"name\": \"Tod Browning\",\n" + 
        "      \"role\": \"director\"\n" + 
        "    }\n" + 
        "  ],\n" + 
        "  \"description\": \"Pretty good horror flick\",\n" + 
        "  \"id\": \"abc123\",\n" + 
        "  \"owned\": true,\n" + 
        "  \"poster\": \"drac.png\",\n" + 
        "  \"rating\": 5,\n" + 
        "  \"title\": \"Dracula\",\n" + 
        "  \"webRef\": {\n" + 
        "    \"ref\": \"tt0021814\",\n" + 
        "    \"site\": \"imdb.com\"\n" + 
        "  },\n" + 
        "  \"year\": 1931\n" + 
        "}";
    
    @Test
    public void testToJson() {
        Movie movie = new Movie("abc123", "Dracula");
        movie.setYear(1931);
        movie.setRating(5);
        movie.setDescription("Pretty good horror flick");
        movie.setOwned(true);
        movie.setPoster("drac.png");
        List<Credit> credits = new ArrayList<>();
        credits.add(new Credit("Bela Lugosi", "Dracula"));
        credits.add(new Credit("Tod Browning", "director"));
        movie.setCredits(credits);
        movie.setWebRef(new WebRef("imdb.com", "tt0021814"));
        
        JSONObject jsonObj = movie.toJson();
        assertEquals(jsonObj.toString(2), JSON);
    }

    @Test
    public void testCreate() {
        JSONObject json = new JsonObject(JSON);
        Movie movie = new Movie("abc123", new Movie(json));
        assertEquals(movie.getYear(), 1931);
        assertEquals(movie.getRating(), 5, 0);
        assertEquals(movie.getDescription(), "Pretty good horror flick");
        assertTrue(movie.isOwned());
        assertEquals(movie.getPoster(), "drac.png");
        List<Credit> credits = movie.getCredits();
        assertTrue(credits.size() == 2);
        Credit c = credits.get(0);
        assertEquals(c.getName(), "Bela Lugosi");
        assertEquals(c.getRole(), "Dracula");
        c = credits.get(1);
        assertEquals(c.getName(), "Tod Browning");
        assertEquals(c.getRole(), "director");
        WebRef webRef = movie.getWebRef();
        assertNotNull(webRef);
        assertEquals(webRef.getSite(), "imdb.com");
        assertEquals(webRef.getRef(), "tt0021814");
    }
}
