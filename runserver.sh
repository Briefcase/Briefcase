cd briefcase
find . -name "*.pyc" -exec rm {} \;
python2.7 manage.py runserver
cd ..
