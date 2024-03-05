from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

import mysql.connector

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="chatbot"
)

app = FastAPI()

origins = ["*"]  # Adjust these origins according to your frontend URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
class Response(BaseModel):
    response: str
    tag_id: int = None

class Pattern(BaseModel):
    tag_id: int
    pattern: str

@app.get("/data")
async def get_data():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patterns")
    data = cursor.fetchall()
    cursor.close()
    return data

@app.get("/datapatterns")
async def get_data_patterns():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM patterns")
    data = cursor.fetchall()
    cursor.close()
    return data

@app.get('/getpattern/{id}')
async def get_pattern(id):
    cursor = db.cursor()
    query = "SELECT tag_id, id, pattern FROM patterns WHERE id=%s"
    cursor.execute(query, (id, ))
    data = cursor.fetchone()
    cursor.close()
    if data is None:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return {"id": data[0], "tag_id": data[1], "pattern": data[2]}

@app.get('/dataresponses')
async def get_data_responses():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM responses")
    data = cursor.fetchall()
    cursor.close()
    return data

@app.post('/insertpatterns')
async def post_patterns(pattern: Pattern):
    cursor = db.cursor()
    query = "INSERT INTO patterns (tag_id, pattern) VALUES(%s, %s)"
    cursor.execute(query, (pattern.tag_id, pattern.pattern))
    db.commit()
    cursor.close()
    return pattern

@app.put('/updatepattern/{id}')
async def update_pattern(id, pattern):
    cursor = db.cursor()
    query = "UPDATE patterns SET pattern=%s WHERE id=%s"
    cursor.execute(query, (pattern, id))
    db.commit()
    cursor.close()
    return pattern

@app.delete('/deletepattern/{id}')
async def delete_pattern(id):
    cursor = db.cursor()
    query = "DELETE FROM patterns WHERE ID=%s"
    cursor.execute(query, (id, ))
    db.commit()
    cursor.close()
    return {"id" : id}

@app.get("/responses")
def get_responses():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM responses")
    data = cursor.fetchall()
    cursor.close()
    return data

@app.get("/responses/{id}")
def get_responses_by_id(id: int):
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM responses WHERE id = %s", (id,))
    data = cursor.fetchone()
    cursor.close()
    if data:
        return data
    else:
        raise HTTPException(status_code=404, detail="Data not found")

@app.put("/responses/{id}")
def update_responses(id: int, response: Response):
    cursor = db.cursor(dictionary=True)
    query = "SELECT * FROM responses WHERE id = %s"
    cursor.execute(query, (id,))
    existing_data = cursor.fetchone()

    if existing_data:
        if response.tag_id is not None and not isinstance(response.tag_id, int):
            raise HTTPException(status_code=400, detail="Invalid value for tag_id")

        update_query = "UPDATE responses SET response = %s, tag_id = %s WHERE id = %s"
        cursor.execute(update_query, (response.response, response.tag_id, id))

        db.commit()
        cursor.close()
        return {'message': 'Data updated successfully'}
    else:
        cursor.close()
        raise HTTPException(status_code=404, detail="Data not found")

@app.post("/responses")
def create_response(response: Response):
    cursor = db.cursor(dictionary=True)
    query = "INSERT INTO responses (response, tag_id) VALUES (%s, %s)"
    cursor.execute(query, (response.response, response.tag_id))
    db.commit()
    cursor.close()
    return {'message': 'Response created successfully'}

@app.delete("/responses/{id}")
def delete_response(id: int):
    cursor = db.cursor(dictionary=True)
    query = "SELECT * FROM responses WHERE id = %s"
    cursor.execute(query, (id,))
    existing_data = cursor.fetchone()
    if existing_data:
        delete_query = "DELETE FROM responses WHERE id = %s"
        cursor.execute(delete_query, (id,))
        db.commit()
        cursor.close()
        return {'message': 'Response deleted successfully'}
    else:
        cursor.close()
        raise HTTPException(status_code=404, detail="Response not found")