/* jshint undef: true, unused: true, browser: true, quotmark: single, curly: true */
/* global Ext */
Ext.define('Jarvus.touch.tab.OverflowBar', {
    extend: 'Ext.tab.Bar',
    xtype: 'overflowtabbar',

    config: {
        tabsPerScreen: 5,
        moreButton: {
            title: 'More',
            iconCls: 'chevron-next-large'
        },

        scrollable: {
            direction: 'horizontal',
            disabled: true
        },

        layout: {
            type: 'hbox',
            pack: 'left'
        },
        defaults: {
            xtype: 'tab',
            width: '20vw'
        }
    },

    initialize: function() {
    	var me = this;

    	me.callParent();

    	me.on('resize', 'syncTabScrolling', me);
    },

    updateTabsPerScreen: function(newValue, oldValue) {
        if (oldValue) {
            this.syncTabScrolling();
        }
    },

    applyMoreButton: function(config) {
    	return Ext.factory(config, Ext.tab.Tab, this.getMoreButton());
    },

    updateMoreButton: function(moreButton) {
    	moreButton.on({
    		tap: 'onMoreButtonTap',
    		scope: this,
    		order: 'before'
    	});
    },

    syncTabScrolling: function() {
        var me = this,
        	moreButton = me.getMoreButton(),
            tabsPerScreen = me.getTabsPerScreen(),
            scroller = me.getScrollable().getScroller(),
            containerWidth = scroller.getContainer().getWidth(),
            tabWidth = containerWidth / tabsPerScreen,
            scrollBuffer = 2, // minimum number of pixel difference before engaging scrolling
            tabsWidth, needScroller;

        // set width for all tabs
        me.items.each(function(tab) {
            tab.setWidth(tabWidth);
        });

        // remove more btn if it exists
        me.remove(moreButton, false);

        // measure width of all tabs without More button
        tabsWidth = scroller.getElement().getWidth();
        needScroller = tabsWidth > containerWidth + scrollBuffer;

        // insert/move More button
        if (needScroller) {
            me.insert(
                Math.floor((containerWidth + scrollBuffer) / me.down(':not({isHidden()})').element.getWidth()),
                moreButton
            );
        }
    },

    onMoreButtonTap: function(button) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
        	maxPosition = scroller.getMaxPosition().x;

        me.fireEvent('morebuttontap', button);

        scroller.scrollTo(scroller.position.x < (maxPosition / 2) ? maxPosition : 0, 0, true);

        return false; // cancel tap event
    }

    isTabVisible: function(button) {
        var me = this,
            scroller = me.getScrollable().getScroller(),
            firstPage = (scroller.position.x==0), 
            itemIndex = me.items.indexOf(button),
            tabsPerScreen = me.getTabsPerScreen(); 

        if (firstPage) {
            return (itemIndex<= tabsPerScreen)
        }
        else {
            return (itemIndex > tabsPerScreen)
        }

    }

});

