import Controller from '@ember/controller';
import $ from 'jquery';
import { computed, observer } from '@ember/object';
import { isNone } from '@ember/utils';
import { A } from '@ember/array';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import { translationMacro as t } from 'ember-i18n';




export default Controller.extend({
  sitemap: computed('i18n.locale', function () {
    let i18n = this.get('i18n');

    return {
      nodes: [
        {
          link: 'index',
          caption: i18n.t('forms.application.sitemap.index.caption'),
          title: i18n.t('forms.application.sitemap.index.title'),
          children: null
        }, {
          link: null,
          caption: i18n.t('forms.application.sitemap.flexberry-audit-tests.caption'),
          title: i18n.t('forms.application.sitemap.flexberry-audit-tests.title'),
          children: [{
            link: 'audit-test-simple-class4-l',
            caption: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class4-l.caption'),
            title: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class4-l.title'),
            children: null
          }, {
            link: 'audit-test-simple-class1-l',
            caption: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class1-l.caption'),
            title: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class1-l.title'),
            children: null
          }, {
            link: 'audit-test-simple-class2-l',
            caption: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class2-l.caption'),
            title: i18n.t('forms.application.sitemap.flexberry-audit-tests.audit-test-simple-class2-l.title'),
            children: null
          }]
        }, {
			link: null,
			icon: 'list',
			caption: i18n.t('forms.application.sitemap.audit-forms.caption'),
			title: i18n.t('forms.application.sitemap.audit-forms.title'),
			children: [{
				link: 'i-c-s-soft-s-t-o-r-m-n-e-t-business-audit-objects-audit-entity-l',
				caption: i18n.t('forms.application.sitemap.audit-forms.audit-forms-data.caption'),
				title: i18n.t('forms.application.sitemap.audit-forms.audit-forms-data.title'),
				children: null
			}]
		}
      ]
    };
  }),

  /**
    Locales supported by application.

    @property locales
    @type String[]
    @default ['ru', 'en']
  */
  locales: undefined,
  
    /**
  */
  login: '',

  /**
    Handles changes in userSettingsService.isUserSettingsServiceEnabled.

    @method _userSettingsServiceChanged
    @private
  */
  _userSettingsServiceChanged: observer('userSettingsService.isUserSettingsServiceEnabled', function() {
    this.get('target.router').refresh();
  }),

  /**
    Initializes controller.
  */
  init() {
    this._super(...arguments);

    let i18n = this.get('i18n');
    if (isNone(i18n)) {
      return;
    }

    this.set('locales', ['ru', 'en']);

    // If i18n.locale is long value like 'ru-RU', 'en-GB', ... this code will return short variant 'ru', 'en', etc.
    let shortCurrentLocale = this.get('i18n.locale').split('-')[0];
    let availableLocales = A(this.get('locales'));

    // Force current locale to be one of available,
    // if browser's current language is not supported by dummy application,
    // or if browser's current locale is long value like 'ru-RU', 'en-GB', etc.
    if (!availableLocales.includes(shortCurrentLocale)) {
      i18n.set('locale', 'en');
    } else {
      i18n.set('locale', shortCurrentLocale);
    }
  },

  /**
    Service that triggers objectlistview events.

    @property objectlistviewEventsService
    @type Service
  */
  objectlistviewEventsService: service('objectlistview-events'),

  /**
    Service for managing the state of the application.

    @property appState
    @type AppStateService
  */
  appState: service(),

  actions: {
    /**
      Call `updateWidthTrigger` for `objectlistviewEventsService`.

      @method actions.updateWidth
    */
    updateWidth() {
      this.get('objectlistviewEventsService').updateWidthTrigger();
    },

    /**
      Toggles application sitemap's side bar.

      @method actions.toggleSidebar
    */
    toggleSidebar() {
      let sidebar = $('.ui.sidebar.main.menu');
      sidebar.sidebar('toggle');

      if ($('.inverted.vertical.main.menu').hasClass('visible')) {
        $('.sidebar.icon.text-menu-show').removeClass('hidden');
        $('.sidebar.icon.text-menu-hide').addClass('hidden');
        $('.bgw-opacity').addClass('hidden');
        $('.full.height').css({ transition: 'width 0.45s ease-in-out 0s', width: '100%' });
      } else {
        $('.sidebar.icon.text-menu-show').addClass('hidden');
        $('.sidebar.icon.text-menu-hide').removeClass('hidden');
        $('.bgw-opacity').removeClass('hidden');
        $('.full.height').css({ transition: 'width 0.3s ease-in-out 0s', width: 'calc(100% - ' + sidebar.width() + 'px)' });
      }
    },

    /**
      Toggles application sitemap's side bar in mobile view.

      @method actions.toggleSidebarMobile
    */
    toggleSidebarMobile() {
      $('.ui.sidebar.main.menu').sidebar('toggle');

      if ($('.inverted.vertical.main.menu').hasClass('visible')) {
        $('.sidebar.icon.text-menu-show').removeClass('hidden');
        $('.sidebar.icon.text-menu-hide').addClass('hidden');
        $('.bgw-opacity').addClass('hidden');
      } else {
        $('.sidebar.icon.text-menu-show').addClass('hidden');
        $('.sidebar.icon.text-menu-hide').removeClass('hidden');
        $('.bgw-opacity').removeClass('hidden');
      }
    },
	
	/**
    */
    login() {
      let _this = this;
      let login = _this.get('loginInput');
      let password = _this.get('password');
      if (login && password) {
        _this._resetLoginErrors();
        _this.set('tryToLogin', true);
        $.ajax({
          type: 'GET',
          xhrFields: { withCredentials: true },
          url: `${config.APP.backendUrls.api}/Login(login='${login}',password='${password}')`,
          success(result) {
            _this.set('tryToLogin', false);
            if (result.value === true) {
              _this._resetLoginData(login);
              _this.transitionToRoute('index');
            } else {
              _this.set('errorMessage', t('forms.login.errors.incorrect-auth-data'));
            }
          },
          error() {
            _this.set('tryToLogin', false);
            _this.set('errorMessage', t('forms.login.errors.server-error'));
          },
        });
      } else {
        if (!login) {
          _this.set('emptyLogin', t('forms.login.errors.empty-login'));
        }

        if (!password) {
          _this.set('emptyPassword', t('forms.login.errors.empty-password'));
        }
      }
    },
	
	/**
    */
    logout() {
      let _this = this;
      $.ajax({
        type: 'GET',
        xhrFields: { withCredentials: true },
        url: `${config.APP.backendUrls.api}/Logout()`,
        success(result) {
          if (result.value === true) {
            _this.set('login', '');
          } else {
            _this.set('errorMessage', t('forms.login.errors.unknown-error'));
          }

          _this.transitionToRoute('index');
        },
        error() {
          _this.set('errorMessage', t('forms.login.errors.server-error'));
          _this.transitionToRoute('index');
        },
      });
    },
	
	/**
    */
    goToLoginForm() {
      this.transitionToRoute('login');
    },

    /**
    */
    closeLoginForm() {
      this._resetLoginErrors();
      this.transitionToRoute('index');
    }
  },
  
  _resetLoginErrors() {
    this.setProperties({
      errorMessage: null,
      emptyLogin: null,
      emptyPassword: null,
    });
  },

  /**
  */
  _resetLoginData(login) {
    this.setProperties({
      login: login,
      loginInput: null,
      password: null,
    });
  }
});
