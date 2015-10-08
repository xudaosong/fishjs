###用法###
对指定的DOM元素添加fs-tooltip属性来启用该指令。
> 也可以在程序中通过依赖$tooltip服务来启用该指令,但是它必须依托一个DOM元素才能有效。<br>
> `var myTooltip = $tooltip(element ,{title: 'My Title'});`
###配置###
配置参数可以通过指令上的data-属性传递，或者在$tooltip服务中传递hash对象进行配置。配置名称前加上`data-`，例如`data-animation=""`.
<table style="width:100%;">
<tr><th>字段名称</th><th>字段类型</th><th>默认值</th><th>描述</th></tr>
<tr><td>animation</td><td>string</td><td>am-fade</td><td>使用ngAnimate添加一个CSS动画效果</td></tr>
<tr><td>placement</td><td>string</td><td>'top'</td><td>tab项的名称</td></tr>
<tr><td>trigger</td><td>string</td><td>'hover focus'</td><td>tab项的名称</td></tr>
<tr><td>title</td><td>string</td><td>''</td><td>tab项的名称</td></tr>
<tr><td>html</td><td>boolean</td><td>false</td><td>tab项的名称</td></tr>
<tr><td>delay</td><td>number | object</td><td>0</td><td>tab项的名称</td></tr>
<tr><td>container</td><td>string | false</td><td>false</td><td>tab项的名称</td></tr>
<tr><td>target</td><td>string | DOMElement | false</td><td>false</td><td>tab项的名称</td></tr>
<tr><td>template</td><td>path</td><td>false</td><td>tab项的名称</td></tr>
<tr><td>contentTemplate</td><td>path</td><td>false</td><td>tab项的名称</td></tr>
<tr><td>prefixEvent</td><td>string</td><td>'tooltip'</td><td>tab项的名称</td></tr>
<tr><td>id</td><td>string</td><td>''</td><td>tooltip的实例ID，用于事件句柄</td></tr>
<tr><td>viewport</td><td>string | object</td><td>{ selector: 'body', padding: 0 }</td><td></td></tr>
</table>
###帮助属性###
###方法###
`$show()`Reveals the tooltip.<br>
`$hide()`Hides the tooltip.<br>
`$toggle()`Toggles the tooltip.<br>
`$setEnabled(isEnabled)`Enables or disables the tooltip.<br>