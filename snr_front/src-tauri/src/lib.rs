// #[cfg_attr(mobile, tauri::mobile_entry_point)]
// pub fn run() {
//   tauri::Builder::default()
//     .setup(|app| {
//       if cfg!(debug_assertions) {
//         app.handle().plugin(
//           tauri_plugin_log::Builder::default()
//             .level(log::LevelFilter::Info)
//             .build(),
//         )?;
//       }
//       Ok(())
//     })
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

// src-tauri/src/lib.rs

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    #[cfg(debug_assertions)]
    {
        let _ = env_logger::try_init();
    }

    log::info!("Приложение запущено");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
        ])
        
        .setup(|_app| {
            Ok(())
        })
        
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}