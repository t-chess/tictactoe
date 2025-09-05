use actix_web::{delete, web, get, post, HttpResponse, Responder};
use crate::helpers::to_gamedata;
use crate::types::EditBody;
use crate::AppState;
use crate::types::DBGameRow;
use crate::types::GameData;
use crate::types::CreateBody;
use std::time::{SystemTime, UNIX_EPOCH};

#[get("/")]
async fn get_games(state: web::Data<AppState>)-> impl Responder {
    let q = r#"SELECT id, rows, cols, num_to_win, history, created_at FROM games_rust ORDER BY id DESC"#;
    match sqlx::query_as::<_, DBGameRow>(q).fetch_all(&state.db).await {
        Ok(rows) => {
            let body: Vec<GameData> = rows.into_iter().map(to_gamedata).collect();
            HttpResponse::Ok().json(serde_json::json!({ "ok": true, "body": body }))
        }
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() })),
    }

}
#[get("/{id}")]
async fn get_game(state: web::Data<AppState>,id:web::Path<i64>)-> impl Responder {
    let q = r#"SELECT id, rows, cols, num_to_win, history, created_at FROM games_rust WHERE id = ? "#;
    match sqlx::query_as::<_,DBGameRow>(q).bind(*id).fetch_optional(&state.db).await {
        Ok(Some(row)) => { HttpResponse::Ok().json(serde_json::json!({ "ok": true, "body": to_gamedata(row) })) }
        Ok(None) => { HttpResponse::NotFound().json(serde_json::json!({ "error": "invalid game id" })) }
        Err(e) => { HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() })) }
    }
}
#[post("/new")]
async fn create_game(state: web::Data<AppState>,body: web::Json<CreateBody>)-> impl Responder {
    let b = body.into_inner();
    let created_at = SystemTime::now().duration_since(UNIX_EPOCH).map(|d| d.as_millis() as i64).unwrap_or(0);
    let history_json = b.history.to_string();
    let q = r#"INSERT INTO games_rust (rows, cols, num_to_win, history, created_at) VALUES (?, ?, ?, ?, ?) "#;
    match sqlx::query(q).bind(b.rows).bind(b.cols).bind(b.num_to_win).bind(history_json).bind(created_at)
    .execute(&state.db).await{
        Ok(res) => {HttpResponse::Ok().json(serde_json::json!({"ok":true,"body":res.last_insert_rowid()})) }
        Err(e) => { HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() })) }
    }
}
#[post("/edit")]
async fn edit_game(state: web::Data<AppState>,body: web::Json<EditBody>)-> impl Responder {
    let b = body.into_inner();
    let history_json = b.history.to_string();
    let q = r#"UPDATE games_rust (rows, cols, num_to_win, history) VALUES (?, ?, ?, ?) WHERE id = ? "#;
    match sqlx::query(q).bind(b.rows).bind(b.cols).bind(b.num_to_win).bind(history_json).bind(b.id)
    .execute(&state.db).await{
        Ok(_) => {HttpResponse::Ok().json(serde_json::json!({"ok":true})) }
        Err(e) => { HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() })) }
    }
}
#[delete("/{id}")]
async fn delete_game(state: web::Data<AppState>,id: web::Path<i64>)-> impl Responder {
    let q = r#"DELETE FROM games_rust WHERE id = ?"#;
    match sqlx::query(q).bind(*id).execute(&state.db).await {
        Ok(res) if res.rows_affected() == 0 => {
            HttpResponse::NotFound().json(serde_json::json!({ "error": "game not found" }))
        }
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({ "ok": true })),
        Err(e) => HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() })),
    }
}