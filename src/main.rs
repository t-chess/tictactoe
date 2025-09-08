use actix_cors::Cors;
use actix_web::{App, HttpServer, web};
use sqlx::{SqlitePool, sqlite::SqlitePoolOptions};

mod db;
mod helpers;
mod routes;
mod types;

#[derive(Clone)]
struct AppState {
    db: SqlitePool,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenvy::dotenv().ok();
    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect("sqlite://./games.db")
        .await
        .expect("failed to connect to sqLite");
    db::ensure_schema(&pool).await.expect("schema");
    let state = AppState { db: pool };
    println!("Listening on http://0.0.0.0:3001");
    HttpServer::new(move || {
        App::new()
            .wrap(Cors::permissive())
            .app_data(web::Data::new(state.clone()))
            .service(
                web::scope("/api/games")
                    .service(routes::get_games)
                    .service(routes::get_game)
                    .service(routes::create_game)
                    .service(routes::edit_game)
                    .service(routes::delete_game),
            )
    })
    .bind(("0.0.0.0", 3001))?
    .run()
    .await
}
