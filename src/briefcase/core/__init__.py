from briefcase.core.register import module
print "auto detects?", __name__
from briefcase.core.async import sockets  # add the sokets variable to the namespace


# this function checks through all the 
def autodiscover():

    print "Auto discover Called!"
    """
    Auto-discover INSTALLED_APPS briefcaseRegister.py modules and fail silently when
    not present. This forces an import on them to register any document types they
    may want.
    """

    import copy
    from django.conf import settings
    from django.utils.importlib import import_module
    from django.utils.module_loading import module_has_submodule


    for app in settings.INSTALLED_APPS:
        mod = import_module(app)
        # Attempt to import the app's admin module.
        try:
            before_import_registry = copy.copy(module._documentTypes)
            import_module('%s.briefcaseRegister' % app)
        except:
            # Reset the model registry to the state before the last import as
            # this import will have to reoccur on the next request and this
            # could raise NotRegistered and AlreadyRegistered exceptions
            # (see #8245).
            module._documentTypes = before_import_registry

            # Decide whether to bubble up this error. If the app just
            # doesn't have an admin module, we can ignore the error
            # attempting to import it, otherwise we want it to bubble up.
            if module_has_submodule(mod, 'briefcaseRegister'):
                raise
    print "finished parsing"
    sockets.begin() # after all the documents have registerd start the websocket
