from bson import ObjectId
from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import urllib.parse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


uri = "mongodb+srv://Visitor:researchgogogo@reseearch.a2rwr6l.mongodb.net/"

# Connect to MongoDB Atlas
client = MongoClient(uri)
db = client['research']
collection = db['data']

class PatternResponse(BaseModel):
    patterns: list[str]
    responses: list[str]

class PatternModel(BaseModel):
    tag: str
    pattern: str

class ResponseModel(BaseModel):
    response: str
    
class TagCreate(BaseModel):
    tag: str
    data: PatternResponse

@app.get("/contents")
async def get_contents():
    try:
        contents = list(collection.find({}))
        for content in contents:
            content["_id"] = str(content["_id"])
        return contents
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.get("/patterns/")
async def get_all_patterns():
    try:
        patterns = collection.distinct("patterns")
        return patterns
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.post("/patterns/")
async def create_pattern(pattern: PatternModel):
    try:
        # Insert the pattern into MongoDB
        result = collection.insert_one({"pattern": pattern.pattern})
        # Return the inserted pattern
        return JSONResponse(content={"message": "Pattern created successfully", "id": str(result.inserted_id)}, status_code=201)
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.put("/patterns/{pattern_id}")
async def update_pattern(pattern_id: str, pattern: PatternModel):
    try:
        # Update the pattern in MongoDB
        result = collection.update_one({"_id": ObjectId(pattern_id)}, {"$set": {"pattern": pattern.pattern}})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Pattern not found")
        # Return success message
        return JSONResponse(content={"message": "Pattern updated successfully"})
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.delete("/patterns/{pattern_id}")
async def delete_pattern(pattern_id: str):
    try:
        # Delete the pattern from MongoDB
        result = collection.delete_one({"_id": ObjectId(pattern_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Pattern not found")
        # Return success message
        return JSONResponse(content={"message": "Pattern deleted successfully"})
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.get("/tags/")
async def get_all_tags():
    try:
        tags = collection.distinct("tag")
        return tags
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.get("/tags/{tag_id}")
async def get_tag_by_id(tag_id: str):
    try:
        tag_object_id = ObjectId(tag_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    tag = collection.find_one({"_id": tag_object_id})
    if tag:
        tag["_id"] = str(tag["_id"]) 
        return tag
    else:
        raise HTTPException(status_code=404, detail=f"Tag with id '{tag_id}' not found")


@app.post("/tags/")
async def create_tag(tag_data: TagCreate):
    tag = tag_data.tag
    data = tag_data.data.dict()

    if collection.find_one({"tag": tag}):
        raise HTTPException(status_code=400, detail=f"Tag '{tag}' already exists")

    try:
        collection.insert_one({"tag": tag, **data})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create tag: {str(e)}")

    return {"message": f"Tag '{tag}' created successfully"}

@app.put("/tags/{tag_id}")
async def update_tag(tag_id: str, tag_data: TagCreate):
    data = tag_data.data.dict()

    try:
        tag_object_id = ObjectId(tag_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    if not collection.find_one({"_id": tag_object_id}):
        raise HTTPException(status_code=404, detail=f"Tag with id '{tag_id}' not found")

    try:
        collection.update_one({"_id": tag_object_id}, {"$set": data})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update tag: {str(e)}")

    return {"message": f"Tag with id '{tag_id}' updated successfully"}

@app.delete("/tags/{tag_id}")
async def delete_tag(tag_id: str):
    try:
        tag_object_id = ObjectId(tag_id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid ObjectId")

    if not collection.find_one({"_id": tag_object_id}):
        raise HTTPException(status_code=404, detail=f"Tag with id '{tag_id}' not found")

    try:
        result = collection.delete_one({"_id": tag_object_id})
        if result.deleted_count == 1:
            return {"message": f"Tag with id '{tag_id}' deleted successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to delete tag")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete tag: {str(e)}")


@app.get("/responses/")
async def get_all_responses():
    try:
        responses = collection.distinct("responses")
        return responses
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)
    
@app.post("/responses/{tag}")
async def create_response(tag: str, response: ResponseModel):
    try:
        # Check if the tag exists in the database
        existing_tag = collection.find_one({"tag": tag})
        if existing_tag is None:
            raise HTTPException(status_code=404, detail="Tag not found")
        
        # Update the existing tag document to add the response
        result = collection.update_one({"tag": tag}, {"$push": {"responses": response.response}})
        if result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update tag")
        
        return {"message": "Response added to existing tag successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.put("/responses/{response_id}")
async def update_response(response_id: str, response: ResponseModel):
    try:
        # Update the response in MongoDB
        result = collection.update_one({"_id": ObjectId(response_id)}, {"$set": {"response": response.response}})
        if result.modified_count == 0:
            raise HTTPException(status_code=404, detail="Response not found")
        # Return success message
        return JSONResponse(content={"message": "Response updated successfully"})
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)

@app.delete("/responses/{response_id}")
async def delete_response(response_id: str):
    try:
        # Delete the response from MongoDB
        result = collection.delete_one({"_id": ObjectId(response_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Response not found")
        # Return success message
        return JSONResponse(content={"message": "Response deleted successfully"})
    except Exception as e:
        return JSONResponse(content={"message": "Internal server error"}, status_code=500)



if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)
