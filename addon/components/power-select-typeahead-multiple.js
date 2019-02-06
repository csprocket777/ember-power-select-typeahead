import Component from '@ember/component';
import { computed } from '@ember/object';
import layout from '../templates/components/power-select-typeahead-multiple';
import { isEqual } from '@ember/utils';
import fallbackIfUndefined from '../utils/computed-fallback-if-undefined';

export default Component.extend({
  tagName: '',
  layout,
  tabindex: -1,
  triggerComponent: fallbackIfUndefined('power-select-typeahead-multiple/trigger'),
  beforeOptionsComponent: fallbackIfUndefined(null),
  searchEnabled: false,
  loadingMessage: null,
  noMatchesMessage: null,

  // CPs
  concatenatedTriggerClasses: computed('triggerClass', function() {
    let classes = ['ember-power-select-typeahead-multiple-trigger'];
    let passedClass = this.get('triggerClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  concatenatedDropdownClasses: computed('dropdownClass', function() {
    let classes = ['ember-power-select-typeahead-dropdown'];
    let passedClass = this.get('dropdownClass');
    if (passedClass) {
      classes.push(passedClass);
    }
    return classes.join(' ');
  }),

  actions: {
    onKeyDown(select, e) {
      let action = this.get('onkeydown');

      // if user passes `onkeydown` action
      if (!action || action(select, e) !== false) {
        // if escape, then clear out selection
        if (e.keyCode === 27) {
          select.actions.choose(null);
        }
      }
    },
    
    handleOpen(select, e) {
      let action = this.get('onopen');
      if (action && action(select, e) === false) {
        return false;
      }
      this.focusInput(select);
    },

    handleFocus(select, e) {
      let action = this.get('onfocus');
      if (action) {
        action(select, e);
      }
      this.focusInput(select);
    },

    handleKeydown(select, e) {
      let action = this.get('onkeydown');
      if (action && action(select, e) === false) {
        e.stopPropagation();
        return false;
      }
      if (e.keyCode === 13 && select.isOpen) {
        e.stopPropagation();
        if (select.highlighted !== undefined) {
          if (!select.selected || select.selected.indexOf(select.highlighted) === -1) {
            select.actions.choose(select.highlighted, e);
            return false;
          } else {
            select.actions.close(e);
            return false;
          }
        } else {
          select.actions.close(e);
          return false;
        }
      }
    },

    buildSelection(option, select) {
      let newSelection = (select.selected || []).slice(0);
      let idx = -1;
      for (let i = 0; i < newSelection.length; i++) {
        if (isEqual(newSelection[i], option)) {
          idx = i;
          break;
        }
      }
      if (idx > -1) {
        newSelection.splice(idx, 1);
      } else {
        newSelection.push(option);
      }
      return newSelection;
    }
  },

  selected: computed({
    get() {
      return [];
    },
    set(_, v) {
      if (v === null || v === undefined) {
        return [];
      }
      return v;
    }
  }),

  computedTabIndex: computed('tabindex', 'searchEnabled', 'triggerComponent', function() {
    if (this.get('triggerComponent') === 'power-select-multiple/trigger' && this.get('searchEnabled') !== false) {
      return '-1';
    } else {
      return this.get('tabindex');
    }
  }),


  // Methods
  focusInput(select) {
    if (select) {
      let input = document.querySelector(`#ember-power-select-trigger-multiple-input-${select.uniqueId}`);
      if (input) {
        input.focus();
      }
    }
  }
});
