import React from 'react';
import { Provider } from 'react-redux';
import createStore from 'state';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import _ from 'lang';
const _l = _('en');
import cookieLiterals from 'lang/cookies_en';

import CookiePage from './index';
configure({ adapter: new Adapter() });
console.warn = jest.fn();

const { store } = createStore();

describe('<CookiePage />', () => {
  const logoSrc = '/assets/logo.png';
  const splashLogoSrc = '/assets/splash.png';
  let wrapper, shell, meta;

  beforeEach(() => {
    wrapper = mount(
      <Provider store={ store }>
        <CookiePage pageContext={ { logoSrc, splashLogoSrc, stringLiterals: cookieLiterals } } />
      </Provider>
    );
    shell = wrapper.find('Shell');
    meta = wrapper.find('Meta');
  });

  describe('should render', () => {
    it('a Shell component', () => {
      expect(wrapper).toContainMatchingElement('Shell');
    });

    it('a Meta component', () => {
      expect(wrapper).toContainMatchingElement('Meta');
    });

    it('a PageTitle component', () => {
      expect(wrapper).toContainMatchingElement('PageTitle');
    });

    it('a PageSubtitle component', () => {
      expect(wrapper).toContainMatchingElement('PageSubtitle');
    });

    it('3 SimpleCard components', () => {
      expect(wrapper).toContainMatchingElements(5, 'SimpleCard');
    });
  });

  it('should pass the correct data to the Shell component', () => {
    expect(shell.prop('logoSrc')).toBe(logoSrc);
    expect(shell.prop('isSearch')).toBe(false);
    expect(shell.prop('isListing')).toBe(false);
  });

  it('should pass the correct data to the Meta component', () => {
    expect(meta.prop('logoSrc')).toBe(splashLogoSrc);
    expect(meta.prop('title')).toBe(_l('Cookie policy'));
  });
});

