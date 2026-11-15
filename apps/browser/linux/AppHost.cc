#include <gtk/gtk.h>
#include <iostream>

static void on_activate(GtkApplication* app, gpointer user_data) {
  GtkWidget* window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), "Ardia");
  gtk_window_set_default_size(GTK_WINDOW(window), 1280, 800);

  // Set dark theme preference for GTK
  GtkSettings* settings = gtk_settings_get_default();
  if (settings) {
    g_object_set(settings, "gtk-application-prefer-dark-theme", TRUE, NULL);
  }

  gtk_window_present(GTK_WINDOW(window));
}

int main(int argc, char** argv) {
  GtkApplication* app = gtk_application_new("com.ardia.browser", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(app, "activate", G_CALLBACK(on_activate), NULL);
  int status = g_application_run(G_APPLICATION(app), argc, argv);
  g_object_unref(app);
  return status;
}
