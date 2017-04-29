package io.limberest.demo.model;

import org.json.JSONException;
import org.json.JSONObject;

import io.limberest.json.Jsonable;
import io.swagger.annotations.ApiModelProperty;

public class Item implements Jsonable {
    
    private String id;
    public String getId() { return id; }

    @ApiModelProperty(required=true)
    private String title;
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public Item(JSONObject json) throws JSONException {
        bind(json);
        // manually bind id since it has no public setter
        if (json.has("id"))
            id = json.getString("id");
    }
    
    public Item(String id, String title) {
        this.id = id;
        this.title = title;
    }    
}
