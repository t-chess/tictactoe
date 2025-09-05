use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Serialize)]
pub struct GameData {
    pub id: i64,
    pub rows: i32,
    pub cols: i32,
    pub num_to_win: i32,
    pub(crate) history: Value,
    pub created_at: i64,
}

#[derive(Debug, sqlx::FromRow)]
pub struct DBGameRow {
    pub id: i64,
    pub rows: i32,
    pub cols: i32,
    pub num_to_win: i32,
    pub history: String,
    pub created_at: i64,
}
#[derive(Deserialize)]
pub struct CreateBody {
    pub rows: i32,
    pub cols: i32,
    pub num_to_win: i32,
    pub history: Value,
}

#[derive(Deserialize)]
pub struct EditBody {
    pub id: i64,
    pub rows: i32,
    pub cols: i32,
    pub num_to_win: i32,
    pub history: Value,
}