from flask import render_template

JS_MODULE = '/assets/js/{0}.js'
CSS_MODULE = '/assets/css/{0}.css'

def template(filename, **kwargs):
    return render_template(filename + ".html",
        csspath=CSS_MODULE.format(filename),
        jspath=JS_MODULE.format(filename),
        **kwargs)