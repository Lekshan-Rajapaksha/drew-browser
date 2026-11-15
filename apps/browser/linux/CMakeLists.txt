cmake_minimum_required(VERSION 3.20)
project(ArdiaLinux LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(PkgConfig REQUIRED)
pkg_check_modules(GTK4 REQUIRED gtk4)

add_executable(Ardia
    AppHost.cc
)

target_include_directories(Ardia PRIVATE ${GTK4_INCLUDE_DIRS})
target_link_libraries(Ardia PRIVATE ${GTK4_LIBRARIES})
target_compile_options(Ardia PRIVATE ${GTK4_CFLAGS_OTHER})

