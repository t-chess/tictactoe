use crate::types::DBGameRow;
use crate::types::GameData;
use serde_json::Value;

#[inline]
pub fn to_gamedata(row: DBGameRow) -> GameData {
    GameData {
        id: row.id,
        rows: row.rows,
        cols: row.cols,
        num_to_win: row.num_to_win,
        history: serde_json::from_str(&row.history).unwrap_or(Value::Null),
        created_at: row.created_at,
    }
}