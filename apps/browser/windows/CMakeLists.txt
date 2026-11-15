cmake_minimum_required(VERSION 3.20)
project(ArdiaWindows LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(Ardia WIN32
    AppHost.cc
)

target_link_libraries(Ardia PRIVATE
    dwmapi
    user32
    gdi32
)

set_target_properties(Ardia PROPERTIES
    OUTPUT_NAME "Ardia"
    WIN32_EXECUTABLE TRUE
)

