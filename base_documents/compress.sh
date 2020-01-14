#!/bin/bash
echo "Compressing contents of directory $1 into ODT compatible document $2 ... "
# Move into document source directory
cd "$1"
find . -name '.DS_Store' -type f -delete
# Special zipping procedure to create correctly structured ODT file
# Remember that if the provided resulting file path is relative, it shall be so in respect to the current working directory!
# First comes the "mimetype" file ...
zip -0 -X "$2" mimetype   #1>/dev/null
# ... then everything else follows
zip -r "$2" * -x mimetype   #1>/dev/null