var width = 640, height=480;

var cells = [];

var w = 20, h = 20;
var cellSize = 15;

var startCell, endCell;

function draw()
{   
	for(var i = 0; i<w; i++){
		for(var j = 0; j<h; j++){
			
			var value = cells[i][j];
			if(!value.disabled){
				
				var color1, color2, color3;
				
				if(value != startCell && value != endCell){
					if(value.color == 'grey'){
						color1 = makecol(145,145,145);
						color2 = makecol(100,100,100);
						color3 = makecol(200,200,200);
					}else if(value.color == 'white'){
						color1 = makecol(145,0,0);
						color2 = makecol(100,0,0);
						color3 = makecol(200,0,0)
					}else{
						color1 = makecol(145,0,0);
						color2 = makecol(100,0,0);
						color3 = makecol(200,0,0);
					}
				}else if(value == endCell){
					color1 = makecol(0,0,145);
					color2 = makecol(0,0,100);
					color3 = makecol(0,0,200);
				}else if(value == startCell){
					color1 = makecol(0,145,0);
					color2 = makecol(0,100,0);
					color3 = makecol(0,200,0);
				}
				
				
				polygonfill(canvas,4,[value.x+cellSize, value.y-value.height, value.x, value.y+cellSize/2-value.height, value.x-cellSize, value.y-value.height, value.x, value.y-cellSize/2-value.height],color1);
				polygonfill(canvas,4,[value.x+cellSize, value.y-value.height, value.x, value.y+cellSize/2-value.height, value.x, value.y+cellSize/2, value.x + cellSize, value.y],color2);
				polygonfill(canvas,4,[value.x-cellSize, value.y-value.height, value.x, value.y+cellSize/2-value.height, value.x, value.y+cellSize/2, value.x - cellSize, value.y],color3);
				
				line (canvas, value.x+cellSize, value.y-value.height, value.x, value.y+cellSize/2-value.height, makecol(255,255,255), 1);
				line (canvas, value.x-cellSize, value.y-value.height, value.x, value.y+cellSize/2-value.height, makecol(255,255,255), 1);
				line (canvas, value.x+cellSize, value.y-value.height, value.x, value.y-cellSize/2-value.height, makecol(255,255,255), 1);
				line (canvas, value.x-cellSize, value.y-value.height, value.x, value.y-cellSize/2-value.height, makecol(255,255,255), 1);
				line (canvas, value.x+cellSize, value.y-value.height, value.x+cellSize, value.y, makecol(255,255,255), 1);
				line (canvas, value.x-cellSize, value.y-value.height, value.x-cellSize, value.y, makecol(255,255,255), 1);
				line (canvas, value.x, value.y+cellSize/2-value.height, value.x, value.y+cellSize/2, makecol(255,255,255), 1);
				
			}
		}
	}
	
}

function update()
{	

}

function controls ()
{
	for(var i = 0; i<w; i++){
		for(var j = 0; j<h; j++){
			
			value = cells[i][j];
			
			if(abs(mouse_x - value.x)<cellSize && abs(mouse_y - value.y + value.height)<cellSize/2){
				if(
					cross(mouse_x, mouse_y, value.x, value.y - value.height, value.x -cellSize/2, value.y - value.height, value.x, value.y-cellSize/2 - value.height) ||
					cross(mouse_x, mouse_y, value.x, value.y - value.height, value.x -cellSize/2, value.y - value.height, value.x, value.y+cellSize/2 - value.height) ||
					cross(mouse_x, mouse_y, value.x, value.y - value.height, value.x +cellSize/2, value.y - value.height, value.x, value.y-cellSize/2 - value.height) ||
					cross(mouse_x, mouse_y, value.x, value.y - value.height, value.x +cellSize/2, value.y - value.height, value.x, value.y+cellSize/2 - value.height)
				){
					if(value.color != 'white'){
						value.color = 'grey';
					}
				}else{
					if(mouse_pressed && !value.disabled){
						if(startCell == undefined && endCell == undefined){
							startCell = value;
						}else if(endCell == undefined && value != startCell){
							endCell = value;
							aStar();
						}else if(endCell != undefined && startCell != undefined){
							startCell = value;
							endCell = undefined;
							clearColor();
						}
						
					}
					if(value.color != 'white'){
						value.color = 'red';
					}
					
				}
			}else{
				if(value.color != 'white'){
					value.color = 'grey';
				}
				
			}
	
		}
	}
}

function clearColor(){
	for(var i = 0; i< w; i++){
		for(var j = 0; j<h; j++){
			cells[i][j].color = 'grey';
		}
	}
}

function events()
{

}

function dispose ()
{

}

function main()
{
    enable_debug('debug');
    allegro_init_all("game_canvas", width, height);
	load_elements();
	ready(function(){
        loop(function(){
            clear_to_color(canvas,makecol(255,255,255));
			dispose();
			controls();
            update();
			events();
            draw();
        },BPS_TO_TIMER(60));
    });
    return 0;
}
END_OF_MAIN();

function load_elements()
{
	cells = [];
	for(var j =0; j < w; j++){
		cells[j] = []
		for(var i =0; i < h; i++){
			cells[j][i] = {
				xPos: j,
				yPos: i,
				x: width/2 + cellSize*i - cellSize*j,
				y: height/2 - max(w,h)*cellSize/2 + cellSize/2*j + cellSize/2*i + cellSize/2, 
				height: cellSize,//rand()%50,
				color: 'grey',
				disabled : frand()<0.2,
				f : 9007199254740992
			}
		}
	}
}

function cross(x1,y1,x2,y2,x3,y3,x4,y4){
	
	if ((det_matrix(x1, y1, x2, y2, x3, y3))*(det_matrix(x1, y1, x2, y2, x4, y4))>=0){
		return false; 
	}else if ((det_matrix(x3, y3, x4, y4, x1, y1))*(det_matrix(x3, y3, x4, y4, x2, y2))>=0){
		return false;
	}
	else{
		return true;
	}
}

function max(i,j){
	return i >= j ? i:j;
}

function det_matrix(xx,xy,yx,yy,zx,zy)
{
	return (xx*yy + yx*zy + zx*xy - zx*yy - xx*zy - yx*xy);
}

function aStar(){
	front = new BinaryHeap(function(node){
		return node.f;
	});
	startCell.f = 0;
	front.push(startCell);
	came_from = new Map();
	cost_so_far = new Map();
	came_from.set(startCell, null);
	cost_so_far.set(startCell, 0);
	var current;
	
	while( front.size() > 0){

		current = front.pop()
	
		if(current == endCell){
			break;
		}
		
		//console.log(getNeighbors(current));
		
		getNeighbors(current).forEach(function(value){
			var new_cost = cost_so_far.get(current) + 1;
			if(cost_so_far.get(value) == undefined || new_cost < cost_so_far.get(value)){
				cost_so_far.set(value, new_cost);
				priority = new_cost + heuristic(endCell, value);
				value.f = priority;
				front.push(value);
				came_from.set(value, current);
			}
		});
	}
	
	//console.log(came_from);
	getRoute(came_from);
}

function getRoute(came_from){
	var current = came_from.get(endCell);
	while(current != null){
		current.color = 'white';
		current = came_from.get(current);
	}
}

function getNeighbors(cell){
	var set = new Set();
	if(cell.xPos >= 1 && !cells[cell.xPos-1][cell.yPos].disabled)
		set.add(cells[cell.xPos-1][cell.yPos]);
	if(cell.xPos < w-1 && !cells[cell.xPos+1][cell.yPos].disabled)
		set.add(cells[cell.xPos+1][cell.yPos]);
	if(cell.yPos >= 1 && !cells[cell.xPos][cell.yPos-1].disabled)
		set.add(cells[cell.xPos][cell.yPos-1]);
	if(cell.yPos < h-1 && !cells[cell.xPos][cell.yPos+1].disabled)
		set.add(cells[cell.xPos][cell.yPos+1]);
	
	return set;
}

function heuristic(a,b){
	return abs(a.xPos - b.xPos)+abs(a.yPos-b.yPos);
}