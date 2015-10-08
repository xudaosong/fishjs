###用法###
1. 在指定的DOM元素上添加bs-tabs属性，并在子元素上添加bs-pane属性。
2. 使用fs-active-pane属性指定当前被选中tab项的信息所保存的变量，可以通过修改变量信息，来改变当前选中的tab项。
3. fs-tabs与fs-pane通过可通过属性修改配置。配置名称前加data-,例如data-animation="show-slowly"
###fs-tabs###
<table style="width:100%;">
<tr><th>字段名称</th><th>字段类型</th><th>默认值</th><th>描述</th></tr>
<tr><td>animation</td><td>string</td><td>am-fade</td><td>使用ngAnimate添加一个CSS动画效果</td></tr>
<tr><td>template</td><td>path</td><td>false</td><td>如果提供了路径，将默认的模板</td></tr>
<tr><td>navClass</td><td>string</td><td>nav-tabs</td><td>使用在tab组件上的样式</td></tr>
<tr><td>activeClass</td><td>string</td><td>active</td><td>使用在被激活的tab项上的样式</td></tr>
</table>
###fs-pane###
<table style="width:100%;">
<tr><th>字段名称</th><th>字段类型</th><th>默认值</th><th>描述</th></tr>
<tr><td>disabled</td><td>string</td><td>false</td><td>控制该tab项是否有效</td></tr>
<tr><td>name</td><td>string</td><td>''</td><td>tab项的名称</td></tr>
</table>