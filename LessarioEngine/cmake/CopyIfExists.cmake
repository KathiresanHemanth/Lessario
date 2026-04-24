# CopyIfExists.cmake
# Called by post-build step. Only copies if SRC directory exists.
if(EXISTS "${SRC}")
    file(COPY "${SRC}/" DESTINATION "${DST}")
    message(STATUS "Assets copied: ${SRC} -> ${DST}")
else()
    message(STATUS "No assets directory found, skipping copy.")
endif()
