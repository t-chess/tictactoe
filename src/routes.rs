use crate::AppState;
use crate::types::CreateBody;
use crate::types::DBGameRow;
use crate::types::EditBody;
use crate::types::GameData;
use actix_web::{HttpResponse, Responder, delete, get, post, web};
use sqlx::{query, query_as};
use std::time::{SystemTime, UNIX_EPOCH};

#[get("/")]
async fn get_games(state: web::Data<AppState>) -> impl Responder {
    match query_as!(
        DBGameRow,
        r#"SELECT id, rows, cols, num_to_win, history, created_at FROM games_rust ORDER BY id DESC"#
    )
    .fetch_all(&state.db)
    .await
    {
        Ok(rows) => {
            let body: Vec<GameData> = rows.into_iter().map(GameData::from).collect();
            HttpResponse::Ok().json(serde_json::json!({ "ok": true, "body": body }))
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() }))
        }
    }
}
#[get("/{id}")]
async fn get_game(state: web::Data<AppState>, id: web::Path<i64>) -> impl Responder {
    match query_as!(
        DBGameRow,
        r#"SELECT id, rows, cols, num_to_win, history, created_at FROM games_rust WHERE id = ? "#,
        *id
    )
    .fetch_optional(&state.db)
    .await
    {
        Ok(Some(row)) => {
            HttpResponse::Ok().json(serde_json::json!({ "ok": true, "body": GameData::from(row) }))
        }
        Ok(None) => {
            HttpResponse::NotFound().json(serde_json::json!({ "error": "invalid game id" }))
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() }))
        }
    }
}
#[post("/new")]
async fn create_game(state: web::Data<AppState>, body: web::Json<CreateBody>) -> impl Responder {
    let body = body.into_inner();
    let created_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as i64)
        .unwrap_or(0);
    let history_json = body.history.to_string();
    match query!(r#"INSERT INTO games_rust (rows, cols, num_to_win, history, created_at) VALUES (?, ?, ?, ?, ?) "#, body.rows,body.cols,body.num_to_win,history_json,created_at)
        .execute(&state.db)
        .await
    {
        Ok(res) => {
            HttpResponse::Ok().json(serde_json::json!({"ok":true,"body":res.last_insert_rowid()}))
        }
        Err(e) => {
            HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() }))
        }
    }
}
#[post("/edit")]
async fn edit_game(state: web::Data<AppState>, body: web::Json<EditBody>) -> impl Responder {
    let body = body.into_inner();
    let history_json = body.history.to_string();
    match query!(
        r#"UPDATE games_rust SET rows=?, cols=?, num_to_win=?, history=? WHERE id = ? "#,
        body.rows,
        body.cols,
        body.num_to_win,
        history_json,
        body.id
    )
    .execute(&state.db)
    .await
    {
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({"ok":true})),
        Err(e) => {
            HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() }))
        }
    }
}
#[delete("/{id}")]
async fn delete_game(state: web::Data<AppState>, id: web::Path<i64>) -> impl Responder {
    match query!(r#"DELETE FROM games_rust WHERE id = ?"#, *id)
        .execute(&state.db)
        .await
    {
        Ok(res) if res.rows_affected() == 0 => {
            HttpResponse::NotFound().json(serde_json::json!({ "error": "game not found" }))
        }
        Ok(_) => HttpResponse::Ok().json(serde_json::json!({ "ok": true })),
        Err(e) => {
            HttpResponse::InternalServerError().json(serde_json::json!({ "error": e.to_string() }))
        }
    }
}
